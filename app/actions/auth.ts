'use server'

import { z } from 'zod';
import { getUserByCredentials } from '@/app/lib/data';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import NextAuth, { AuthError } from 'next-auth';
import { authConfig } from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';
import { LoginState, RegisterState, UserRegistrationSchema } from '@/app/lib/definitions';
import { revalidatePath } from 'next/cache';
import { getRequestContext } from '@/app/lib/utils';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.email(),
            password: z.string().min(6),
            subdomain: z.string().min(1),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password, subdomain } = parsedCredentials.data;
          const user = await getUserByCredentials(email, password, subdomain);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log(`\n\n\nUser encontrado ${user} com a sua senha ebaaaa ${password} ó o que da o ${passwordsMatch}\n\n\n`);

          if (passwordsMatch) return user;
        }
        
        console.log('Credenciais inválidas fornecidas.');
        return null;
      },
    }),

  ],
});

// --- Server Actions ---

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
    const { subdomain, tenantId: companyId } = await getRequestContext();

    if (!subdomain || !companyId) {
        return { error: 'Acesso inválido. Não foi possível identificar a empresa.' };
    }

    const validatedFields = UserRegistrationSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.issues.map(e => e.message).join(', ');
        return { error: `Erro de validação: ${errorMessages}` };
    }

    const { email, name, password, role } = validatedFields.data;
    
    const tenantPrisma = getTenantPrismaClient(subdomain);

    try {
        const company = await tenantPrisma.company.findFirst();
        if (!company) {
            return { error: 'Configuração de empresa não encontrada para este tenant.' };
        }

        const existingUser = await tenantPrisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { error: 'Este email já está em uso.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await tenantPrisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                companyId: company.id,
            },
        });

        revalidatePath('/dashboard/users');
        return { success: true };

    } catch (dbError) {
        console.error("Database Error:", dbError);
        return { error: 'Falha ao registrar usuário. Tente novamente.' };
    }
}

export async function authenticate(
  prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const { subdomain } = await getRequestContext();
  const host = (await headers()).get('host');

  try {
    if (typeof subdomain !== 'string' || !subdomain) {
      return { error: 'Não foi possível identificar a empresa. Tente novamente.' };
    }
    
    formData.append('subdomain', subdomain);

    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Credenciais inválidas. Verifique o seu e-mail e palavra-passe.' };
        default:
          return { error: 'Ocorreu um erro inesperado. Tente novamente.' };
      }
    }
    throw error;
  }

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const redirectUrl = `${protocol}://${host}/dashboard`;
  redirect(redirectUrl);
}

export async function handleSignOut() {
    await signOut({ redirect: false });
    redirect('/login');
}