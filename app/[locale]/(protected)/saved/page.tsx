"use client";

// Displays opportunities saved by the user
import { useTranslations, useLocale } from "next-intl";
import { useSaved } from "@/context/SavedContext";
import OpportunityCard from "@/components/OpportunityCard";
import EmptyState from "@/components/EmptyState";
import { isRTL } from "@/lib/utils";
import { Trash2, Bookmark } from "lucide-react";

export default function SavedPage() {
    const t = useTranslations("saved");
    const locale = useLocale();
    const rtl = isRTL(locale);
    // Get saved opportunities and actions from context
    const { savedOpportunities, toggleSave, clearAll } = useSaved();

    return (
        <div dir={rtl ? "rtl" : "ltr"} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Header - shows title and clear all button if there are saved items */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-3">
                        <Bookmark className="w-7 h-7 text-indigo-500" /> {t("title")}
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">{t("subtitle")}</p>
                </div>
                {savedOpportunities.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Clear All
                    </button>
                )}
            </div>
            {/* Empty state - shown when no opportunities are saved */}
            {savedOpportunities.length === 0 ? (
                <EmptyState
                    icon="🔖"
                    title={t("empty")}
                    subtitle={t("emptySubtitle")}
                    action={{ label: t("browse"), href: "/opportunities" }}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {savedOpportunities.map((opp) => (
                        <OpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                </div>
            )}
        </div>
    );
}
