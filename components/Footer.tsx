import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { isRTL } from "@/lib/utils";

export default function Footer() {
    // Load localized content
    const t = useTranslations("footer");
    const tNav = useTranslations("nav");
    // Determine the current layout direction
    const locale = useLocale();
    const rtl = isRTL(locale);

    return (
        <footer dir={rtl ? "rtl" : "ltr"} className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400 mb-3">
                            <span>OpenPath</span>
                        </Link>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            {t("tagline")}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                            {t("links")}
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { href: "/", label: tNav("home") },
                                { href: "/opportunities", label: tNav("opportunities") },
                                { href: "/about", label: tNav("about") },
                                { href: "/contact", label: tNav("contact") },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                            {t("categories")}
                        </h3>
                        <ul className="space-y-2">
                            {["Job", "Internship", "Scholarship", "Online Course", "Remote Work", "Volunteer"].map((cat) => (
                                <li key={cat}>
                                    <Link
                                        href={`/opportunities?category=${encodeURIComponent(cat)}`}
                                        className="text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Demo Note */}
                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                            {t("legal")}
                        </h3>
                        <div className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                            ⚠️ All data on this platform is demo data for educational purposes only.
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-neutral-400 dark:text-neutral-500">
                        © 2026 OpenPath. {t("rights")}.
                    </p>
                    <p className="text-sm text-neutral-400 dark:text-neutral-500">{t("madeWith")}</p>
                </div>
            </div>
        </footer>
    );
}
