// Uses useActionState to manage form state and error messages
"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/[locale]/(auth)/login/actions";
import { cn } from "@/lib/utils";
import { LogIn, Loader2 } from "lucide-react";

interface LoginFormProps {
    callbackUrl: string;
    locale: string;   // Current locale for redirects
}

const initialState = { error: undefined as string | undefined };

export default function LoginForm({ callbackUrl, locale }: LoginFormProps) {
    // useActionState connects form to server action and tracks pending state
    const [state, formAction, isPending] = useActionState(loginAction, initialState);

    const inputClass =
        "w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white dark:placeholder:text-neutral-500";

    return (
        <form
            action={formAction}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4"
        >
            {/* Hidden field to pass callbackUrl to server action */}
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="user@example.com"
                    className={inputClass}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className={inputClass}
                />
            </div>

            {state?.error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    ⚠️ {state.error}
                </div>
            )}
            {/* Submit button */}
            <button
                type="submit"
                disabled={isPending}
                className={cn(
                    "w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2",
                    isPending && "opacity-70 cursor-not-allowed"
                )}
            >
                {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                ) : (
                    <><LogIn className="w-4 h-4" /> Sign in</>
                )}
            </button>
        </form>
    );
}
