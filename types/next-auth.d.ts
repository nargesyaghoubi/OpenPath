// Extending NextAuth default types to include custom fields
// This is required because NextAuth doesn't include 'role' and 'id' by default

import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        role?: string // User role: "user" or "admin"
    }

    interface Session {
        user: {
            id: string   // User ID
            role?: string // User role
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string   // User ID in token
        role?: string // User role in token
    }
}