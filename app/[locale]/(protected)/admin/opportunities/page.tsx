"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { isRTL } from "@/lib/utils";
import { Opportunity } from "@/types";
import { CATEGORY_COLORS, CATEGORY_ICONS, formatDeadline } from "@/lib/utils";
import { ShieldCheck, Check, X, Loader2 } from "lucide-react";

type StatusFilter = "PENDING" | "APPROVED" | "REJECTED";

export default function AdminOpportunitiesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const t = useTranslations("admin");
    const locale = useLocale();
    const rtl = isRTL(locale);
    const user = session?.user as { role?: string } | undefined;

    const [filter, setFilter] = useState<StatusFilter>("PENDING");
    const [items, setItems] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const filterLabels: Record<StatusFilter, string> = {
        PENDING: t("filterPending"),
        APPROVED: t("filterApproved"),
        REJECTED: t("filterRejected"),
    };

    const load = useCallback(async (status: StatusFilter) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/opportunities?status=${status}`, { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to load opportunities");
            const data = await res.json();
            setItems(data.opportunities ?? []);
            setError(null);
        } catch {
            setError(t("loadError"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        if (status === "authenticated" && user?.role === "admin") {
            load(filter);
        }
    }, [status, user?.role, filter, load]);

    // Redirect non-admins away
    useEffect(() => {
        if (status === "authenticated" && user?.role !== "admin") {
            router.replace("/dashboard");
        }
    }, [status, user?.role, router]);

    const act = async (id: string, action: "approve" | "reject") => {
        setBusyId(id);
        try {
            const reason =
                action === "reject" ? window.prompt(t("rejectPrompt")) ?? undefined : undefined;
            const res = await fetch(`/api/admin/opportunities/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, reason }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            setItems((prev) => prev.filter((o) => o.id !== id));
        } catch {
            setError(t("actionError"));
        } finally {
            setBusyId(null);
        }
    };

    if (status === "loading" || (status === "authenticated" && user?.role !== "admin")) {
        return (
            <div className="flex items-center justify-center py-24 text-neutral-400">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    return (
        <div dir={rtl ? "rtl" : "ltr"} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-indigo-500" />
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{t("title")}</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">{t("subtitle")}</p>
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                {(["PENDING", "APPROVED", "REJECTED"] as StatusFilter[]).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${filter === s
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            }`}
                    >
                        {filterLabels[s]}
                    </button>
                ))}
            </div>

            {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 mb-4">
                    ⚠️ {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-16 text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-16 text-neutral-400 dark:text-neutral-500">
                    {t("noItems")}
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((opp) => (
                        <div
                            key={opp.id}
                            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[opp.category]}`}>
                                            {CATEGORY_ICONS[opp.category]} {opp.category}
                                        </span>
                                        <span className="text-xs text-neutral-400">{formatDeadline(opp.deadline)}</span>
                                    </div>
                                    <h3 className="font-semibold text-neutral-900 dark:text-white truncate">{opp.title}</h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {opp.organization} · {opp.location}, {opp.country}
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 line-clamp-3">
                                        {opp.description}
                                    </p>
                                    {opp.rejectReason && (
                                        <p className="text-xs text-red-500 mt-2">{t("rejectedReason", { reason: opp.rejectReason })}</p>
                                    )}
                                </div>
                                {filter === "PENDING" && (
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            disabled={busyId === opp.id}
                                            onClick={() => act(opp.id, "approve")}
                                            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors"
                                            title={t("approve")}
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            disabled={busyId === opp.id}
                                            onClick={() => act(opp.id, "reject")}
                                            className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 transition-colors"
                                            title={t("reject")}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
