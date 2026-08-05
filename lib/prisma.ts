import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient instance across hot reloads in development,
// otherwise every file change would open a new pool of DB connections.
declare global {
    var __openpathPrisma: PrismaClient | undefined;
}

export const prisma =
    globalThis.__openpathPrisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalThis.__openpathPrisma = prisma;
}
