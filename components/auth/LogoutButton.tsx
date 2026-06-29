"use client";
// Calls logoutAction server action and shows loading state while signing out
import { useTransition } from "react";
import { logoutAction } from "@/app/[locale]/(auth)/login/actions";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
    // useTransition tracks pending state without blocking UI
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => startTransition(() => logoutAction())}
            disabled={isPending}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 transition-colors disabled:opacity-60"
        >
            {/* Show spinner while signing out, otherwise show logout icon */}
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <LogOut className="w-4 h-4" />
            )}
            {isPending ? "Signing out…" : "Sign out"}
        </button>
    );
}
