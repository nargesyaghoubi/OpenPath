"use client";
// Page for submitting a new opportunity.
import { useTranslations, useLocale } from "next-intl";
import { isRTL } from "@/lib/utils";
import { Plus } from "lucide-react";
import OpportunityForm from "@/components/OpportunityForm";

export default function AddOpportunityPage() {
    const t = useTranslations("addOpportunity");
    const locale = useLocale();
    const rtl = isRTL(locale);
    // Add opportunity page layout
    return (
        <div dir={rtl ? "rtl" : "ltr"} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-3">
                    <Plus className="w-7 h-7 text-indigo-500" /> {t("title")}
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">{t("subtitle")}</p>
            </div>
            {/* Opportunity submission form */}
            <OpportunityForm mode="add" />
        </div>
    );
}
