// Authentication configuration using NextAuth.js
// Currently using mock credentials - can be replaced with a real database later

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
    // Use JWT strategy for session management
    session: {
        strategy: "jwt",
    },
    // Custom pages
    pages: {
        signIn: "/fa/auth/login",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const email = String(credentials?.email || "").trim().toLowerCase()
                const password = String(credentials?.password || "")

                if (!email || !password) return null

                // Mock user - replace with real database lookup later
                if (email === "admin@kaaryab.com" && password === "admin123") {
                    return {
                        id: "1",
                        name: "Admin",
                        email: "admin@kaaryab.com",
                        role: "admin",
                    }
                }

                return null
            },
        }),
    ],
    callbacks: {
        // Add custom fields to JWT token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        // Add custom fields to session
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session
        },
    },
})