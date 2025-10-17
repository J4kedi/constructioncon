import { UserRole } from '@prisma/client';
import NextAuth, { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      companyId: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
    companyId: string;
    avatarUrl: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    companyId: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  }
}