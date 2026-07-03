"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { cn, LOCALE_NAMES, LOCALE_FLAGS, isRTL } from "@/lib/utils";
import { useSaved } from "@/context/SavedContext";
import { useTheme } from "@/components/ThemeProvider";
import UserMenu from "@/components/auth/UserMenu";
import {
    Menu, X, Bookmark, LayoutDashboard, Plus, Globe,
    Sun, Moon, ChevronDown, LogIn, FileText,
} from "lucide-react";


// Navbar component props
interface NavbarClientProps {
    user: { name: string; email: string; role: string } | null;
    locale: string;
}

export default function NavbarClient({ user, locale }: NavbarClientProps) {
    // Translation helper
    const t = useTranslations("nav");
    const pathname = usePathname();
    const router = useRouter();
    const { savedIds } = useSaved();
    const { theme, toggleTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const rtl = isRTL(locale);

    // Primary navigation items
    const navLinks = [
        { href: "/", label: t("home") },
        { href: "/opportunities", label: t("opportunities") },
        { href: "/about", label: t("about") },
        { href: "/contact", label: t("contact") },
    ];

    // Handle locale switching
    const changeLocale = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
        setLangOpen(false);
    };

    return (
        <nav
            dir={rtl ? "rtl" : "ltr"}
            className="sticky top-0 z-50 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
                        <span className="text-2xl">🌍</span>
                        <span>OpenPath</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    pathname === link.href
                                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Dashboard — only if logged in */}
                        {user && (
                            <Link
                                href="/dashboard"
                                className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>{t("dashboard")}</span>
                            </Link>
                        )}

                        {/* Saved */}
                        <Link
                            href="/saved"
                            className="relative hidden md:flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <Bookmark className="w-4 h-4" />
                            {savedIds.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {savedIds.length}
                                </span>
                            )}
                        </Link>

                        {/* CV Builder — only if logged in */}
                        {user && (
                            <Link
                                href="/cv-builder"
                                className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                <span>CV Builder</span>
                            </Link>
                        )}

                        {/* Add opportunity */}
                        {user && (
                            <Link
                                href="/add-opportunity"
                                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden lg:inline">{t("addOpportunity")}</span>
                            </Link>
                        )}

                        {/* Language picker */}
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="hidden sm:inline">{LOCALE_FLAGS[locale]}</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            {langOpen && (
                                <div className={cn(
                                    "absolute top-full mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-1 z-50",
                                    rtl ? "left-0" : "right-0"
                                )}>
                                    {routing.locales.map((loc) => (
                                        <button
                                            key={loc}
                                            onClick={() => changeLocale(loc)}
                                            className={cn(
                                                "w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                                                locale === loc && "text-indigo-600 dark:text-indigo-400 font-medium"
                                            )}
                                        >
                                            <span>{LOCALE_FLAGS[loc]}</span>
                                            <span>{LOCALE_NAMES[loc]}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {/* Auth: user menu or login */}
                        {user ? (
                            <UserMenu name={user.name} email={user.email} role={user.role} locale={locale} />
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <LogIn className="w-4 h-4" /> {t("login")}
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                "block px-3 py-2.5 rounded-lg text-sm font-medium",
                                pathname === link.href
                                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                                    : "text-neutral-600 dark:text-neutral-400"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <>
                            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                                <LayoutDashboard className="w-4 h-4" /> {t("dashboard")}
                            </Link>
                            <Link href="/cv-builder" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                                <FileText className="w-4 h-4" /> CV Builder
                            </Link>
                            <Link href="/add-opportunity" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white mt-2">
                                <Plus className="w-4 h-4" /> {t("addOpportunity")}
                            </Link>
                        </>
                    )}
                    {!user && (
                        <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 mt-2">
                            <LogIn className="w-4 h-4" /> {t("login")}
                        </Link>
                    )}
                    <Link href="/saved" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <Bookmark className="w-4 h-4" /> {t("saved")} {savedIds.length > 0 && `(${savedIds.length})`}
                    </Link>
                </div>
            )}
        </nav>
    );
}
