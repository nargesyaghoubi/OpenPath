import type { SVGProps } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { isRTL } from "@/lib/utils";

// Small inline brand icons (no external icon-library dependency, so there's
// no risk of a missing export breaking the build).
function GithubIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.535-1.5.115-3.135 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.65 1.635.24 2.835.12 3.135.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}
function XIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}
function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}
function InstagramIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

const socialLinks = [
    { href: "https://github.com/nargesyaghoubi", label: "GitHub", Icon: GithubIcon },
    { href: "https://x.com/N_Yaghoubi", label: "X", Icon: XIcon },
    { href: "https://www.linkedin.com/in/narges-yaghoubi-656a28243/", label: "LinkedIn", Icon: LinkedinIcon },
    { href: "https://www.instagram.com/narges_ygh_/", label: "Instagram", Icon: InstagramIcon },
];

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
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
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
                                        className="text-sm text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect - social links */}
                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                            {t("connect")}
                        </h3>
                        <div className="flex flex-col gap-2.5">
                            {socialLinks.map(({ href, label, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 text-sm text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors"
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Demo Note */}
                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                            {t("legal")}
                        </h3>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                            ⚠️ All data on this platform is demo data for educational purposes only.
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        © 2026 OpenPath. {t("rights")}.
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("madeWith")}</p>
                </div>
            </div>
        </footer>
    );
}
