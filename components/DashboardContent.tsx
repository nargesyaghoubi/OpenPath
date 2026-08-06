"use client";
// Dashboard content with live statistics, charts, and recent opportunities.
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useOpportunities } from "@/context/OpportunitiesContext";
import { isExpiringSoon, formatDeadline, CATEGORY_COLORS, CATEGORY_ICONS, cn } from "@/lib/utils";
import DashboardCard from "@/components/DashboardCard";
import DashboardCharts from "@/components/DashboardCharts";
import { LayoutDashboard, ShieldCheck, ClipboardList } from "lucide-react";
import { Opportunity } from "@/types";

interface DashboardContentProps {
    user: { name: string; email: string; role?: string };
}

// Shows live stats/charts from OpportunitiesContext, plus a
// "My Submissions" panel with this user's items and review status
const STATUS_STYLES: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    APPROVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function DashboardContent({ user }: DashboardContentProps) {
    const t = useTranslations("dashboard");
    const tOpp = useTranslations("opportunities");
    const locale = useLocale();
    const { opportunities } = useOpportunities();
    const [mine, setMine] = useState<Opportunity[]>([]);
    const [mineLoading, setMineLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/opportunities/mine", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    if (!cancelled) setMine(data.opportunities ?? []);
                }
            } finally {
                if (!cancelled) setMineLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Calculate dashboard statistics from the current opportunities list
    const jobs = opportunities.filter((o) => o.category === "Job").length;
    const scholarships = opportunities.filter((o) => o.category === "Scholarship").length;
    const internships = opportunities.filter((o) => o.category === "Internship").length;
    const remote = opportunities.filter((o) => o.type === "Remote").length;
    const expiring = opportunities.filter((o) => isExpiringSoon(o.deadline)).length;

    const recent = [...opportunities]
        .sort((a, b) => (b.postedAt || "").localeCompare(a.postedAt || ""))
        .slice(0, 6);

    return (
        <>
            {/* Welcome banner */}
            <div className="mb-8 bg-gradient-to-r from-indigo-600 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-1">
                    <LayoutDashboard className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">{t("title")}</h1>
                </div>
                <p className="text-indigo-100">
                    {t("welcomeBack")} <strong>{user.name}</strong>
                    {user.role === "admin" && (
                        <span className="ml-2 inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium">
                            <ShieldCheck className="w-3 h-3" /> {t("adminBadge")}
                        </span>
                    )}
                </p>
                <p className="text-indigo-100/70 text-sm mt-0.5">{user.email}</p>
                {user.role === "admin" && (
                    <Link
                        href="/admin/opportunities"
                        className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-medium transition-colors"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" /> {t("reviewLink")}
                    </Link>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <DashboardCard title={t("stats.total")} value={opportunities.length} icon={LayoutDashboard} color="indigo" />
                <DashboardCard title={t("stats.jobs")} value={jobs} icon={LayoutDashboard} color="blue" />
                <DashboardCard title={t("stats.scholarships")} value={scholarships} icon={LayoutDashboard} color="indigo" />
                <DashboardCard title={t("stats.internships")} value={internships} icon={LayoutDashboard} color="green" />
                <DashboardCard title={t("stats.remote")} value={remote} icon={LayoutDashboard} color="cyan" />
                <DashboardCard title={t("stats.expiringSoon")} value={expiring} icon={LayoutDashboard} color="red" />
            </div>

            {/* Charts */}
            <DashboardCharts opportunities={opportunities} t={{ chartTitle: t("chartTitle"), countryChartTitle: t("countryChartTitle") }} />

            {/* My submissions — tracks review status for opportunities this user submitted */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mt-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-500" /> {t("mySubmissions")}
                </h2>
                {mineLoading ? (
                    <p className="text-sm text-neutral-400">{t("loadingEllipsis")}</p>
                ) : mine.length === 0 ? (
                    <p className="text-sm text-neutral-400">
                        {t("noSubmissions")}{" "}
                        <Link href="/add-opportunity" className="text-indigo-600 dark:text-indigo-400 font-medium">
                            {t("addOne")}
                        </Link>
                        .
                    </p>
                ) : (
                    <div className="space-y-3">
                        {mine.map((opp) => (
                            <div
                                key={opp.id}
                                className="flex items-center justify-between gap-3 border border-neutral-100 dark:border-neutral-800 rounded-xl px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium text-neutral-900 dark:text-white text-sm">{opp.title}</p>
                                    <p className="text-xs text-neutral-400">{opp.organization}</p>
                                    {opp.status === "REJECTED" && opp.rejectReason && (
                                        <p className="text-xs text-red-500 mt-1">{t("reasonLabel")}: {opp.rejectReason}</p>
                                    )}
                                </div>
                                <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full shrink-0", STATUS_STYLES[opp.status ?? "PENDING"])}>
                                    {opp.status === "PENDING" ? tOpp("statusPending") : opp.status === "REJECTED" ? tOpp("statusRejected") : tOpp("statusApproved")}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent submissions */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mt-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-5">{t("recentTitle")}</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                <th className="text-left py-3 px-2 text-neutral-500 dark:text-neutral-400 font-medium">Title</th>
                                <th className="text-left py-3 px-2 text-neutral-500 dark:text-neutral-400 font-medium hidden sm:table-cell">Country</th>
                                <th className="text-left py-3 px-2 text-neutral-500 dark:text-neutral-400 font-medium">Category</th>
                                <th className="text-left py-3 px-2 text-neutral-500 dark:text-neutral-400 font-medium hidden md:table-cell">Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent.map((opp) => (
                                <tr key={opp.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <td className="py-3 px-2">
                                        <Link href={`/opportunities/${opp.id}`} className="font-medium text-neutral-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            {opp.title}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-2 text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">
                                        {opp.countryCode === "GL" ? "🌐" : ""} {opp.country}
                                    </td>
                                    <td className="py-3 px-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[opp.category]}`}>
                                            {CATEGORY_ICONS[opp.category]} {opp.category}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2 text-neutral-500 dark:text-neutral-400 hidden md:table-cell">{formatDeadline(opp.deadline)}</td>
                                </tr>
                            ))}
                            {recent.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-neutral-400 dark:text-neutral-500">
                                        {t("noData")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
