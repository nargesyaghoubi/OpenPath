"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import { Opportunity } from "@/types";
import { useSaved } from "@/context/SavedContext";
import { cn, CATEGORY_COLORS, CATEGORY_ICONS, formatDeadline, isExpiringSoon, isExpired } from "@/lib/utils";
import { Bookmark, BookmarkCheck, MapPin, Calendar, ArrowRight, Trash2, Edit } from "lucide-react";

// Opportunity card component props
interface OpportunityCardProps {
    opportunity: Opportunity;
    onDelete?: (id: string) => void;
    onEdit?: (opportunity: Opportunity) => void;
    showActions?: boolean;
}

export default function OpportunityCard({ opportunity, onDelete, onEdit, showActions }: OpportunityCardProps) {
    const t = useTranslations("opportunities");
    const { toggleSave, isSaved } = useSaved();
    // Card state
    const saved = isSaved(opportunity.id);
    const expiring = isExpiringSoon(opportunity.deadline);
    const expired = isExpired(opportunity.deadline);

    return (
        <motion.div
            whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(139,92,246,0.12)" }}
            transition={{ duration: 0.2 }}
            className={cn(
                "group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors duration-200 h-full flex flex-col",
                expired && "opacity-60"
            )}
        >
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", CATEGORY_COLORS[opportunity.category])}>
                    {CATEGORY_ICONS[opportunity.category]} {opportunity.category}
                </span>
                <span className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-full",
                    opportunity.type === "Remote"
                        ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300"
                        : opportunity.type === "Hybrid"
                            ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                            : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                )}>
                    {opportunity.type}
                </span>
                {opportunity.status && opportunity.status !== "APPROVED" && (
                    <span className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full",
                        opportunity.status === "REJECTED"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    )}>
                        {opportunity.status === "REJECTED" ? t("statusRejected") : t("statusPending")}
                    </span>
                )}
                {opportunity.featured && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        ⭐ {t("featured")}
                    </span>
                )}
                {expiring && !expired && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-pulse">
                        🔥 {t("expiringSoon")}
                    </span>
                )}
            </div>
            {/* Opportunity title */}
            <h3 className="font-semibold text-neutral-900 dark:text-white text-base mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {opportunity.title}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">{opportunity.organization}</p>
            <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-3">🌍 {opportunity.country}</p>
            {/* Organization details */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500 mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{opportunity.location}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDeadline(opportunity.deadline)}</span>
            </div>

            {opportunity.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {opportunity.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2 mt-auto">
                <Link
                    href={`/opportunities/${opportunity.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                    {t("viewDetails")} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {/* Save / Unsave action */}
                <button
                    onClick={() => toggleSave(opportunity)}
                    className={cn(
                        "p-2 rounded-xl border transition-colors",
                        saved
                            ? "bg-indigo-50 border-indigo-300 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400"
                            : "border-neutral-200 text-neutral-400 hover:border-indigo-300 hover:text-indigo-600 dark:border-neutral-700 dark:hover:border-indigo-700"
                    )}
                >
                    {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
                {/* Edit action (dashboard only) */}
                {showActions && onEdit && (
                    <button onClick={() => onEdit(opportunity)}
                        className="p-2 rounded-xl border border-neutral-200 text-neutral-400 hover:border-blue-300 hover:text-blue-600 dark:border-neutral-700 transition-colors">
                        <Edit className="w-4 h-4" />
                    </button>
                )}
                {/* Delete action (dashboard only) */}
                {showActions && onDelete && (
                    <button onClick={() => onDelete(opportunity.id)}
                        className="p-2 rounded-xl border border-neutral-200 text-neutral-400 hover:border-red-300 hover:text-red-600 dark:border-neutral-700 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
