import type { NextAuthConfig } from 'next-auth';
import { UserRole } from '@prisma/client';
import { headers } from 'next/headers';
import { getTenantPrismaClient } from '@/app/lib/prisma';
 
export const authConfig = {
  pages: {
    signIn: '/login', 
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.companyId = user.companyId;
        token.name = user.name;
        token.email = user.email;
        token.avatarUrl = user.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.companyId = token.companyId as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.avatarUrl = token.avatarUrl as string | null;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
