import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("password hashing", () => {
    it("hashes a password to a bcrypt hash, not the plain text", async () => {
        const hash = await hashPassword("correct horse battery staple");
        expect(hash).not.toBe("correct horse battery staple");
        expect(hash).toMatch(/^\$2[aby]\$/); // bcrypt hash prefix
    });

    it("verifies a correct password against its hash", async () => {
        const hash = await hashPassword("s3cret-Password!");
        await expect(verifyPassword("s3cret-Password!", hash)).resolves.toBe(true);
    });

    it("rejects an incorrect password", async () => {
        const hash = await hashPassword("s3cret-Password!");
        await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false);
    });

    it("produces a different hash each time (random salt)", async () => {
        const [a, b] = await Promise.all([hashPassword("same-input"), hashPassword("same-input")]);
        expect(a).not.toBe(b);
    });
});
