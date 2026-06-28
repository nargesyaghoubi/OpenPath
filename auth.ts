import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// ── Demo users (in production: replace with DB + bcrypt) ──────────────────────
const users = [
    {
        id: "1",
        name: "Demo User",
        email: "user@example.com",
        password: "user123",
        role: "user",
    },
    {
        id: "2",
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
    },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
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

                const user = users.find((u) => u.email === email);

                // Demo only: plain-text comparison.
                // Production: use bcrypt.compare(password, user.hashedPassword)
                if (!user || user.password !== password) return null;

                return { id: user.id, name: user.name, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // ts-expect-error – role is a custom field
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
