// lib/authOptions.ts
import type { AuthOptions } from "next-auth";
import { getServerSession, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

import "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email?: string | null
            name?: string | null
            role?: string
        }
    }

    interface User {
        role?: string
    }
}

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                rememberMe: { label: "Remember Me", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        password: true,
                        role: true
                    }
                });

                if (!user) return null;

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValid) return null;

                // Return user dengan explicit type assertion
                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role || "ADMIN", // Default role if not provided
                    rememberMe: credentials.rememberMe === "true"
                } as User & { rememberMe: boolean };
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 2 * 60 * 60,
    },
    pages: { signIn: "/admin/login" },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user && account) {
                const userWithRemember = user as User & { rememberMe?: boolean };
                token.id = user.id;
                token.email = user.email || "";
                token.name = user.name || "";
                token.role = user.role || "ADMIN"; // Default role if not provided
                token.rememberMe = userWithRemember.rememberMe || false;

                const now = Math.floor(Date.now() / 1000);
                if (userWithRemember.rememberMe) {
                    token.exp = now + (7 * 24 * 60 * 60);
                } else {
                    token.exp = now + (2 * 60 * 60);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.role = token.role as string;

                if (token.exp && typeof token.exp === 'number') {
                    session.expires = new Date(token.exp * 1000).toISOString();
                }
            }
            return session;
        }
    }
};

export const auth = () => getServerSession(authOptions);