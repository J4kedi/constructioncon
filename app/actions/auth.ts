'use server'

import { z } from 'zod';
import { getUserByCredentials } from '@/app/lib/data/user';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import NextAuth, { AuthError } from 'next-auth';
import { authConfig } from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';
import { LoginState, UserRegistrationSchema, ChangePasswordSchema, FormState } from '@/app/lib/definitions';
import { getRequestContext } from '@/app/lib/server-utils';
import { executeFormAction } from '@/app/lib/action-handler';

import { rateLimiter } from '@/app/lib/rate-limiter';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const ip = rateLimiter.getIp(await headers());
        const parsedCredentials = z
          .object({
            email: z.email(),
            password: z.string(),
            subdomain: z.string().optional(),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password, subdomain } = parsedCredentials.data;
          
          const targetSubdomain = subdomain || 'admin';

          const user = await getUserByCredentials(email, password, targetSubdomain);
          if (!user) {
            rateLimiter.recordFailure(ip);
            return null;
          }

          if (!subdomain && user.role !== 'SUPER_ADMIN') {
            rateLimiter.recordFailure(ip);
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            rateLimiter.clear(ip);
            return user;
          }
        }
        
        rateLimiter.recordFailure(ip);
        return null;
      },
    }),

  ],
});

// --- Server Actions ---

export async function changePassword(prevState: FormState, formData: FormData): Promise<FormState> {
  return executeFormAction({
    formData,
    schema: ChangePasswordSchema,
    logic: async (data, context) => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("Usuário não autenticado.");
      }
      const tenantPrisma = getTenantPrismaClient(context.subdomain);
      const user = await tenantPrisma.user.findUnique({ where: { id: session.user.id } });

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const { oldPassword, newPassword } = data;

      const passwordsMatch = await bcrypt.compare(oldPassword, user.password!);
      if (!passwordsMatch) {
        throw new Error("A senha antiga está incorreta.");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await tenantPrisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
      });
    },
    successMessage: 'Senha alterada com sucesso!',
  });
}

export async function registerUser(prevState: FormState, formData: FormData): Promise<FormState> {
    const { subdomain } = await getRequestContext();


    return executeFormAction({
        formData,
        schema: UserRegistrationSchema,
        revalidatePath: '/dashboard/users',
        redirectPath: '/dashboard/users',
        logic: async (data) => {
            const { email, name, password, role } = data;
            const tenantPrisma = getTenantPrismaClient(subdomain);

            const company = await tenantPrisma.company.findFirst();
            if (!company) {
                throw new Error('Configuração de empresa não encontrada para este tenant.');
            }

            const existingUser = await tenantPrisma.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new Error('Este email já está em uso.');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await tenantPrisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    companyId: company.id,
                    role,
                },
            });
        },
    });
}

export async function authenticate(
  prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const requestHeaders = await headers();
  const ip = rateLimiter.getIp(requestHeaders);
  const { subdomain } = await getRequestContext();
  const host = requestHeaders.get('host');

  const checkResult = rateLimiter.check(ip);
  if (!checkResult.success) {
    return { error: checkResult.error };
  }

  try {
    if (subdomain) {
      formData.append('subdomain', subdomain);
    }

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