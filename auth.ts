import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail } from "@/lib/users-store";
import { verifyPassword } from "@/lib/password";

// User lookup lives in lib/users-store.ts (PostgreSQL via Prisma) so that
// accounts created via the /register page can also sign in.

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    session: { strategy: "jwt" },
    pages: {
        // next-intl prefix will be added in proxy.ts — auth.js just needs base path
        signIn: "/login",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const email = String(credentials?.email ?? "").trim().toLowerCase();
                const password = String(credentials?.password ?? "");

                if (!email || !password) return null;

                const user = await findUserByEmail(email);
                if (!user) return null;

                const valid = await verifyPassword(password, user.passwordHash);
                if (!valid) return null;

                return { id: user.id, name: user.name, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // @ts-expect-error – role is a custom field
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { id?: string }).id = token.id as string;
                (session.user as { role?: string }).role = token.role as string;
            }
            return session;
        },
    },
});
