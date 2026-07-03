"use server";

// Server action for account registration.
// Creates a real (in-memory, demo) user and immediately signs them in,
// so the account they just created can be used right away.

import { z } from "zod/v4";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { addUser, findUserByEmail } from "@/lib/users-store";

// Validation schema using zod
const schema = z
    .object({
        name: z.string().min(2, "Name required"),
        email: z.email("Valid email required"),
        password: z.string().min(6, "At least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export async function registerAction(_prev: unknown, formData: FormData) {
    const raw = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };
    const callbackUrl = (formData.get("callbackUrl") as string) || "/en/dashboard";

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
    }

    if (findUserByEmail(parsed.data.email)) {
        return { error: "An account with this email already exists. Try signing in instead." };
    }

    addUser({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
    });

    try {
        // Automatically sign the new user in right after registering
        await signIn("credentials", {
            email: parsed.data.email,
            password: parsed.data.password,
            redirectTo: callbackUrl,
        });
    } catch (error) {
        // Next.js throws a redirect as an error - rethrow it so redirect works
        if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        if (error instanceof AuthError) {
            return { error: "Account created, but automatic sign-in failed. Please sign in manually." };
        }
        console.error("[registerAction] unexpected error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}
