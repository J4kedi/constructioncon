import type { NextAuthConfig } from 'next-auth';
import { UserRole } from '@prisma/client';
 
export const authConfig = {
  pages: {
    signIn: '/login', 
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as UserRole;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
