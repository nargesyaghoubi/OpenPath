// Redirects to dashboard if user is already logged in
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ callbackUrl?: string }>;
}) {
    const session = await auth();
    const locale = await getLocale();
    const t = await getTranslations("auth.login");
    const params = await searchParams;

    // Use callbackUrl if provided, otherwise go to dashboard
    const callbackUrl = params?.callbackUrl ?? `/${locale}/dashboard`;

    if (session?.user) {
        redirect(callbackUrl);
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-6">
                {/* Header */}
                <div className="text-center">
                    <span className="text-5xl">🌍</span>
                    <h1 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-white">
                        {t("title")}
                    </h1>
                    <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Demo credentials box */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-sm">
                    <p className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                        🔑 Demo Credentials
                    </p>
                    <div className="space-y-1 text-amber-700 dark:text-amber-400">
                        <p><span className="font-medium">User:</span> user@example.com / user123</p>
                        <p><span className="font-medium">Admin:</span> admin@example.com / admin123</p>
                    </div>
                </div>

                {/* Login form (client component) */}
                <LoginForm callbackUrl={callbackUrl} locale={locale} />

                {/* Register link */}
                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                    {t("noAccount")}{" "}
                    <a
                        href={`/${locale}/register`}
                        className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                    >
                        {t("register")}
                    </a>
                </p>
            </div>
        </div>
    );
}
