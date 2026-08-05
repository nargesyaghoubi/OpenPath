// User persistence backed by PostgreSQL (via Prisma).

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import type { Role } from "@prisma/client";

export interface StoredUser {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
}

// Find a user by email address (case-insensitive).
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
    const normalized = email.trim().toLowerCase();
    return prisma.user.findUnique({ where: { email: normalized } });
}

export async function findUserById(id: string): Promise<StoredUser | null> {
    return prisma.user.findUnique({ where: { id } });
}

// Create a new user. Hashes the plain-text password with bcrypt before
// it ever touches the database.
export async function addUser(input: {
    name: string;
    email: string;
    password: string;
    role?: Role;
}): Promise<StoredUser> {
    const passwordHash = await hashPassword(input.password);
    return prisma.user.create({
        data: {
            name: input.name,
            email: input.email.trim().toLowerCase(),
            passwordHash,
            role: input.role ?? "user",
        },
    });
}
