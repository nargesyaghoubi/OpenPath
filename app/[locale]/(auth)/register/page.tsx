"use client";

// Demo only: does not create a real account
// Uses react-hook-form + zod for form validation

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { isRTL, cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { UserPlus, Info } from "lucide-react";

// Validation schema using zod
const schema = z.object({
    name: z.string().min(2, "Name required"),
    email: z.string().email("Valid email required"),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
    const t = useTranslations("auth.register");
    const locale = useLocale();
    const rtl = isRTL(locale);
    const [done, setDone] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async () => {
        await new Promise((r) => setTimeout(r, 600));
        setDone(true);
    };

    // Reusable input and label styles
    const inputClass = "w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-neutral-500";
    const labelClass = "block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5";

    return (
        <div dir={rtl ? "rtl" : "ltr"} className="min-h-[80vh] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <span className="text-5xl">🌍</span>
                    <h1 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-white">{t("title")}</h1>
                    <p className="mt-1 text-neutral-500 dark:text-neutral-400">{t("subtitle")}</p>
                </div>

                {/* Demo notice */}
                <div className="flex gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-sm text-blue-700 dark:text-blue-400">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>This is a demo. Registration doesn't create a real account. Use the <Link href="/login" className="font-medium underline">demo credentials</Link> to sign in.</span>
                </div>

                {done ? (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center">
                        <div className="text-4xl mb-3">✅</div>
                        <p className="text-neutral-700 dark:text-neutral-300 mb-4">Demo registration complete!</p>
                        <Link href="/login" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors">
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
                        <div>
                            <label className={labelClass}>{t("name")}</label>
                            <input {...register("name")} className={inputClass} placeholder="Jane Smith" />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>{t("email")}</label>
                            <input type="email" {...register("email")} className={inputClass} placeholder="jane@example.com" />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>{t("password")}</label>
                            <input type="password" {...register("password")} className={inputClass} placeholder="••••••••" />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>{t("confirmPassword")}</label>
                            <input type="password" {...register("confirmPassword")} className={inputClass} placeholder="••••••••" />
                            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn("w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2", isSubmitting && "opacity-70")}
                        >
                            <UserPlus className="w-4 h-4" /> {isSubmitting ? "Processing…" : t("submit")}
                        </button>
                    </form>
                )}

                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                    {t("hasAccount")}{" "}
                    <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">{t("login")}</Link>
                </p>
            </div>
        </div>
    );
}
