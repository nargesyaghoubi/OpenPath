"use client";

// Shows user info, navigation links, and logout button
import { useTransition, useState } from "react";
import { logoutAction } from "@/app/[locale]/(auth)/login/actions";
import { LogOut, User, ChevronDown, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
    name: string;
    email: string;
    role: string;     // "user" or "admin"
    locale: string;   // Current locale for navigation links
}

export default function UserMenu({ name, email, role, locale }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();  // Logout pending state

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm"
            >
                <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="hidden sm:block font-medium text-neutral-700 dark:text-neutral-300 max-w-[100px] truncate">
                    {name}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg z-50 py-2">
                        {/* User info */}
                        <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{name}</p>
                            <p className="text-xs text-neutral-400 truncate">{email}</p>
                            <span className={cn(
                                "inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full font-medium",
                                role === "admin"
                                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                            )}>
                                {role === "admin" && <ShieldCheck className="w-3 h-3" />}
                                {role}
                            </span>
                        </div>

                        {/* Nav links */}
                        <a
                            href={`/${locale}/dashboard`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            Dashboard
                        </a>
                        <a
                            href={`/${locale}/saved`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            Saved Opportunities
                        </a>

                        {/* Logout */}
                        <div className="border-t border-neutral-100 dark:border-neutral-800 mt-1 pt-1">
                            <button
                                disabled={isPending}
                                onClick={() => startTransition(() => logoutAction())}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-60"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                                {isPending ? "Signing out…" : "Sign out"}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
