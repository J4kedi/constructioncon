import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { publicPrisma as prisma } from "@/app/lib/prisma";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { User } from "@prisma/client"; 

async function getUser(email: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.email(), password: z.string().min(6) })
                    .safeParse(credentials);
                
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);

                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        return user;
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    // 5. Bloco de Callbacks para injetar o tenantId
    callbacks: {
        async jwt({ token, user }) {
            if (user?.tenantId) {
                token.tenantId = user.tenantId;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.tenantId && session.user) {
                session.user.tenantId = token.tenantId as string;
            }
            return session;
        },
    },
});