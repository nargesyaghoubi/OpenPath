"use client";

import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories, locations } from "@/data/opportunities";

// Search filter component props
interface SearchFilterProps {
    search: string;
    category: string;
    location: string;
    type: string;
    sortBy: string;
    onSearch: (v: string) => void;
    onCategory: (v: string) => void;
    onLocation: (v: string) => void;
    onType: (v: string) => void;
    onSort: (v: string) => void;
    onReset: () => void;
    resultCount: number;
}

export default function SearchFilter({
    search, category, location, type, sortBy,
    onSearch, onCategory, onLocation, onType, onSort, onReset,
    resultCount,
}: SearchFilterProps) {
    // Load localized labels
    const t = useTranslations("opportunities");
    // Check whether any filter is currently active
    const hasFilters = search || category || location || type || sortBy !== "newest";

    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4">
            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder={t("search")}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white dark:placeholder:text-neutral-500"
                />
                {search && (
                    <button onClick={() => onSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Filters row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <select
                    value={category}
                    onChange={(e) => onCategory(e.target.value)}
                    className="text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                    <option value="">{t("filters.allCategories")}</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <select
                    value={location}
                    onChange={(e) => onLocation(e.target.value)}
                    className="text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                    <option value="">{t("filters.allLocations")}</option>
                    {locations.map((l) => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>

                <select
                    value={type}
                    onChange={(e) => onType(e.target.value)}
                    className="text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                    <option value="">{t("filters.allTypes")}</option>
                    <option value="Remote">{t("filters.remote")}</option>
                    <option value="On-site">{t("filters.onsite")}</option>
                    <option value="Hybrid">{t("filters.hybrid")}</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => onSort(e.target.value)}
                    className="text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                    <option value="newest">{t("filters.newest")}</option>
                    <option value="deadline">{t("filters.deadline")}</option>
                    <option value="title">{t("filters.title")}</option>
                </select>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {resultCount} {t("title").toLowerCase()}
                </span>
                {hasFilters && (
                    <button
                        onClick={onReset}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Reset
                    </button>
                )}
            </div>
        </div>
    );
}
