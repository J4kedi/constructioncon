'use server';

import { z } from 'zod';
import { getTenantPrismaClient } from '@/app/lib/prisma'; 
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import NextAuth, { AuthError } from 'next-auth';
import { authConfig } from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';

export interface RegisterState {
    error?: string;
    success?: boolean;
}
export interface LoginState {
    error?: string;
    success?: boolean;
}
const RegisterSchema = z.object({
    fullName: z.string().min(3, { message: 'O nome completo é obrigatório.' }),
    email: z.email({ message: 'Por favor, insira um email válido.' }),
    password: z.string().min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' }),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});

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

        console.log(parsedCredentials)

        if (parsedCredentials.success) {
          const { email, password, subdomain } = parsedCredentials.data;
          
          const tenantPrisma = getTenantPrismaClient(subdomain);

          try {
            const user = await tenantPrisma.user.findUnique({ where: { email } });
            
            if (!user) {
              console.log(`Login falhou: Utilizador ${email} não encontrado no tenant ${subdomain}`);
              return null;
            }

            const passwordsMatch = await bcrypt.compare(password, user.password);

            console.log(`\n\n\nUser encontrado ${user} com a sua senha ebaaaa ${password} ó o que da o passwordsMatch ${passwordsMatch}\n\n\n`)

            if (passwordsMatch) {
              return user; // Sucesso!
            }
          } catch (error) {
              console.error(`Erro ao autenticar no tenant ${subdomain}:`, error);
              return null;
          } finally {
              await tenantPrisma.$disconnect();
          }
        }
        
        console.log('Credenciais inválidas fornecidas.');
        return null;
      },
    }),
  ],
});

// --- Server Actions ---

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
    const headersList = headers();
    const subdomain = (await headersList).get('x-tenant-subdomain');
    const companyId = (await headersList).get('x-tenant-id');

    if (typeof subdomain !== 'string' || !subdomain || !companyId) {
        return { error: 'Acesso inválido. Não foi possível identificar a empresa.'};
    }

    const validatedFields = RegisterSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        const firstError = validatedFields.error;
        return { error: `${firstError}: ${firstError.message}` };
    }

    const { email, fullName, password } = validatedFields.data;
    
    const tenantPrisma = getTenantPrismaClient(subdomain);

    try {
        const existingUser = await tenantPrisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { error: 'Este email já está em uso.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await tenantPrisma.user.create({
            data: {
                name: fullName,
                email: email,
                password: hashedPassword,
                companyId: companyId,
            },
        });
    } catch (dbError) {
        console.error("Database Error:", dbError);
        return { error: 'Falha ao registar utilizador. Tente novamente.' };
    } finally {
        await tenantPrisma.$disconnect();
    }

    redirect('/login?registered=true');
}

export async function authenticate(
  prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  try {
    const headersList = headers();
    const subdomain = (await headersList).get('x-tenant-subdomain');
    const host = (await headersList).get('host');

    if (typeof subdomain !== 'string' || !subdomain) {
      return { error: 'Não foi possível identificar a empresa. Tente novamente.' };
    }
    
    formData.append('subdomain', subdomain);

    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const redirectTo = `${protocol}://${host}/dashboard`;

    formData.append('redirectTo', redirectTo);

    await signIn('credentials', formData);
    return { success: true };
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
}

