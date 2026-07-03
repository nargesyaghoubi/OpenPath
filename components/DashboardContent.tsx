"use client";
// Dashboard content with live statistics, charts, and recent opportunities.
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useOpportunities } from "@/context/OpportunitiesContext";
import { isExpiringSoon, formatDeadline, CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/utils";
import DashboardCard from "@/components/DashboardCard";
import DashboardCharts from "@/components/DashboardCharts";
import { LayoutDashboard, ShieldCheck } from "lucide-react";

interface DashboardContentProps {
    user: { name: string; email: string; role?: string };
}

// Client component so stats/charts/table always reflect the live opportunities
// list from OpportunitiesContext (localStorage), including anything the user
// has added, edited, or deleted — not just the original seed data.

export default function DashboardContent({ user }: DashboardContentProps) {
    const t = useTranslations("dashboard");
    const locale = useLocale();
    const { opportunities } = useOpportunities();
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
                    Welcome back, <strong>{user.name}</strong>
                    {user.role === "admin" && (
                        <span className="ml-2 inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium">
                            <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                    )}
                </p>
                <p className="text-indigo-100/70 text-sm mt-0.5">{user.email}</p>
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
