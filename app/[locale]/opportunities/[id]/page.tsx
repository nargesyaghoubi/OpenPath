"use client";

import { useSaved } from "@/context/SavedContext";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import { CATEGORY_COLORS, CATEGORY_ICONS, formatDeadline, isExpiringSoon, isRTL } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Building2, Tag, ExternalLink, Bookmark, BookmarkCheck, CheckCircle2, Pencil, Clock, XCircle, Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import CountdownTimer from "@/components/CountdownTimer";
import { Opportunity } from "@/types";

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Get route params, translations, locale, and opportunity data
    const { id } = use(params);
    const t = useTranslations("details");
    const locale = useLocale();
    const rtl = isRTL(locale);
    const { toggleSave, isSaved } = useSaved();
    const [opp, setOpp] = useState<Opportunity | null>(null);
    const [loading, setLoading] = useState(true);
    const [hardNotFound, setHardNotFound] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/opportunities/${id}`, { cache: "no-store" });
                if (res.status === 404 || res.status === 403) {
                    if (!cancelled) setHardNotFound(true);
                    return;
                }
                if (!res.ok) throw new Error("Failed to load");
                const data = await res.json();
                if (!cancelled) setOpp(data.opportunity);
            } catch {
                if (!cancelled) setHardNotFound(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    if (hardNotFound) return notFound();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24 text-neutral-400">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }
    if (!opp) return notFound();

    if (opp.status && opp.status !== "APPROVED") {
        const isRejected = opp.status === "REJECTED";
        return (
            <div dir={rtl ? "rtl" : "ltr"} className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                {isRejected ? (
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                ) : (
                    <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                )}
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {isRejected ? t("rejectedTitle") : t("pendingTitle")}
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 mb-1">
                    <strong>{opp.title}</strong>
                </p>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                    {isRejected ? t("rejectedBody") : t("pendingBody")}
                </p>
                {opp.rejectReason && (
                    <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-6 inline-block">
                        {t("reasonLabel")}: {opp.rejectReason}
                    </p>
                )}
                <div className="flex items-center justify-center gap-3">
                    <Link href="/dashboard" className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        {t("backToDashboard")}
                    </Link>
                    <Link href={`/edit-opportunity/${opp.id}`} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
                        {t("editSubmission")}
                    </Link>
                </div>
            </div>
        );
    }

    const saved = isSaved(opp.id);
    const expiring = isExpiringSoon(opp.deadline);

    return (
        <div dir={rtl ? "rtl" : "ltr"} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Back navigation */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
                <Link href="/opportunities" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> {t("back")}
                </Link>
            </motion.div>
            {/* Demo data notice */}
            <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
                {t("demoNote")}
            </div>
            {/* Opportunity details layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main */}
                <motion.div
                    className="lg:col-span-2 space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                >
                    {/* Opportunity header */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[opp.category]}`}>
                                {CATEGORY_ICONS[opp.category]} {opp.category}
                            </span>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                {opp.type}
                            </span>
                            {expiring && (
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-pulse">
                                    🔥 Expiring Soon
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">{opp.title}</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> {opp.organization}
                        </p>
                    </div>
                    {/* Opportunity description */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">{t("about")}</h2>
                        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">{opp.description}</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">{t("requirements")}</h2>
                        <ul className="space-y-2">
                            {opp.requirements.map((req, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.06 }}
                                    className="flex items-start gap-3 text-neutral-600 dark:text-neutral-300"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                    {req}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                >
                    {/* Apply and save actions */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
                        <a href={opp.applyLink} target="_blank" rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors mb-3">
                            {t("applyNow")} <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                            onClick={() => toggleSave(opp)}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 border rounded-xl text-sm font-medium transition-colors ${saved
                                ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-700 dark:text-indigo-400"
                                : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-indigo-300"
                                }`}
                        >
                            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            {saved ? t("saved") : t("saveOpportunity")}
                        </button>
                        <Link
                            href={`/edit-opportunity/${opp.id}`}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mt-2 border rounded-xl text-sm font-medium border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        >
                            <Pencil className="w-4 h-4" /> Edit Opportunity
                        </Link>
                    </div>

                    {/* Live countdown to the application deadline */}
                    <CountdownTimer deadline={opp.deadline} />

                    {/* Opportunity metadata */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4">
                        {[
                            { label: t("deadline"), value: formatDeadline(opp.deadline), icon: Calendar },
                            { label: t("location"), value: opp.location, icon: MapPin },
                            { label: t("country"), value: opp.country, icon: Building2 },
                            { label: t("organization"), value: opp.organization, icon: Building2 },
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label}>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-sm font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-indigo-500" /> {value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {opp.tags.length > 0 && (
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                                <Tag className="w-3 h-3" /> {t("tags")}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {/* Render opportunity tags */}
                                {opp.tags.map((tag) => (
                                    <span key={tag} className="text-xs px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}