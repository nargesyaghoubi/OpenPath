"use client";

// Uses useActionState to manage form state and error messages,
// mirroring the pattern used by LoginForm.

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { registerAction } from "@/app/[locale]/(auth)/register/actions";
import { cn } from "@/lib/utils";
import { UserPlus, Loader2 } from "lucide-react";

interface RegisterFormProps {
    callbackUrl: string;
}

const initialState = { error: undefined as string | undefined };

export default function RegisterForm({ callbackUrl }: RegisterFormProps) {
    const t = useTranslations("auth.register");
    // Manage server action state and pending status
    const [state, formAction, isPending] = useActionState(registerAction, initialState);

    const inputClass =
        "w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-neutral-500";
    const labelClass = "block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5";

    return (
        <form
            action={formAction}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4"
        >
            {/* Hidden field to pass callbackUrl to server action */}
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div>
                <label className={labelClass}>{t("name")}</label>
                <input name="name" required placeholder="Jane Smith" className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>{t("email")}</label>
                <input type="email" name="email" required placeholder="jane@example.com" className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>{t("password")}</label>
                <input type="password" name="password" required placeholder="••••••••" className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>{t("confirmPassword")}</label>
                <input type="password" name="confirmPassword" required placeholder="••••••••" className={inputClass} />
            </div>
            {/* Display validation or registration errors */}
            {state?.error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    ⚠️ {state.error}
                </div>
            )}
            {/* Submit button with loading state */}

            <button
                type="submit"
                disabled={isPending}
                className={cn(
                    "w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2",
                    isPending && "opacity-70 cursor-not-allowed"
                )}
            >
                {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                ) : (
                    <><UserPlus className="w-4 h-4" /> {t("submit")}</>
                )}
            </button>
        </form>
    );
}
