"use server";

// Server actions for authentication (login and logout)
// Used by LoginForm and logout button components

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(_prev: unknown, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const callbackUrl = (formData.get("callbackUrl") as string) || "/en/dashboard";

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl,
        });
    } catch (error) {
        // Next.js throws a redirect as an error - rethrow it so redirect works
        if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        // Wrong email or password
        if (error instanceof AuthError) {
            return { error: "Invalid email or password. Try: user@example.com / user123" };
        }
        // Unexpected error
        console.error("[loginAction] unexpected error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

// Signs the user out and redirects to home page
export async function logoutAction() {
    await signOut({ redirectTo: "/en" });
}