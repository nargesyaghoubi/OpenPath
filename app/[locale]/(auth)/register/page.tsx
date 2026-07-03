// Redirects to dashboard if user is already logged in.
// Mirrors the structure of the login page.
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { isRTL } from "@/lib/utils";
import { Info } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ callbackUrl?: string }>;
}) {
    // Get current user session and locale information
    const session = await auth();
    const locale = await getLocale();
    const rtl = isRTL(locale);
    const t = await getTranslations("auth.register");
    const params = await searchParams;
    // Determine where to redirect after successful registration
    const callbackUrl = params?.callbackUrl ?? `/${locale}/dashboard`;
    // Prevent authenticated users from accessing the register page
    if (session?.user) {
        redirect(callbackUrl);
    }

    return (
        <div dir={rtl ? "rtl" : "ltr"} className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-6">
                {/* Registration page heading */}
                <div className="text-center">
                    <span className="text-5xl">🌍</span>
                    <h1 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-white">{t("title")}</h1>
                    <p className="mt-1 text-neutral-500 dark:text-neutral-400">{t("subtitle")}</p>
                </div>

                {/* Demo notice */}
                <div className="flex gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-sm text-blue-700 dark:text-blue-400">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                        Demo project: accounts are stored in memory (not a database), so they reset when the
                        server restarts. Your account works right away after registering.
                    </span>
                </div>

                <RegisterForm callbackUrl={callbackUrl} />

                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                    {t("hasAccount")}{" "}
                    <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                        {t("login")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
