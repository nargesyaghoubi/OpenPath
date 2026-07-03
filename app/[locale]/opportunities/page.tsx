"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useOpportunities } from "@/context/OpportunitiesContext";
import OpportunityCard from "@/components/OpportunityCard";
import SearchFilter from "@/components/SearchFilter";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import { useRouter } from "@/lib/i18n/navigation";
import { isRTL } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export default function OpportunitiesPage() {
    const t = useTranslations("opportunities");
    const locale = useLocale();
    const rtl = isRTL(locale);
    const router = useRouter();
    const { opportunities, deleteOpportunity } = useOpportunities();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    // Filter and sort opportunities based on user selections
    const filtered = useMemo(() => {
        let list = [...opportunities];
        if (search) list = list.filter((o) =>
            o.title.toLowerCase().includes(search.toLowerCase()) ||
            o.organization.toLowerCase().includes(search.toLowerCase())
        );
        if (category) list = list.filter((o) => o.category === category);
        if (location) list = list.filter((o) => o.location === location);
        if (type) list = list.filter((o) => o.type === type);
        if (sortBy === "newest") list.sort((a, b) => (b.postedAt || "").localeCompare(a.postedAt || ""));
        if (sortBy === "deadline") list.sort((a, b) => a.deadline.localeCompare(b.deadline));
        if (sortBy === "title") list.sort((a, b) => a.title.localeCompare(b.title));
        return list;
    }, [opportunities, search, category, location, type, sortBy]);
    // Reset all active filters
    const reset = () => { setSearch(""); setCategory(""); setLocation(""); setType(""); setSortBy("newest"); };

    return (
        <div dir={rtl ? "rtl" : "ltr"} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{t("title")}</h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    {t("subtitle", { count: opportunities.length })}
                </p>
            </motion.div>
            {/* Search and filter controls */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-8"
            >
                <SearchFilter
                    search={search} category={category} location={location} type={type} sortBy={sortBy}
                    onSearch={setSearch} onCategory={setCategory} onLocation={setLocation}
                    onType={setType} onSort={setSortBy} onReset={reset} resultCount={filtered.length}
                />
            </motion.div>
            {/* Display results or empty state */}
            {filtered.length === 0 ? (
                <EmptyState icon="🔍" title={t("noResults")} subtitle={t("noResultsSubtitle")}
                    action={{ label: "Reset Filters", href: "/opportunities" }} />
            ) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map((opp) => (
                            <motion.div
                                key={opp.id}
                                layout
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.94 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* Opportunity card */}
                                <OpportunityCard
                                    opportunity={opp}
                                    showActions
                                    onDelete={(id) => setDeleteTarget(id)}
                                    onEdit={(o) => router.push(`/edit-opportunity/${o.id}`)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
            {/* Delete confirmation modal */}
            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Opportunity" size="sm">
                <p className="text-neutral-600 dark:text-neutral-400 mb-5">
                    Are you sure you want to delete this opportunity? This cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={() => setDeleteTarget(null)}
                        className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => { if (deleteTarget) { deleteOpportunity(deleteTarget); setDeleteTarget(null); } }}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
}