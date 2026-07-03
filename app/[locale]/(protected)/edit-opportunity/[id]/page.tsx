"use client";
// Client page for editing an existing opportunity.
// Loads the opportunity from OpportunitiesContext,
// pre-fills the shared OpportunityForm, and redirects
// back to the details page after saving.
import { use } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { useOpportunities } from "@/context/OpportunitiesContext";
import { isRTL } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import OpportunityForm from "@/components/OpportunityForm";

export default function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const t = useTranslations("addOpportunity");
    const locale = useLocale();
    const rtl = isRTL(locale);
    const router = useRouter();
    const { getById } = useOpportunities();
    // Retrieve the opportunity by its id from the shared context
    const opp = getById(id);

    // If the opportunity doesn't exist (e.g. bad id, or it was deleted), show 404
    if (!opp) return notFound();

    return (
        <div dir={rtl ? "rtl" : "ltr"} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-3">
                    <Pencil className="w-7 h-7 text-indigo-500" /> Edit Opportunity
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">{t("subtitle")}</p>
            </div>
            {/* Reuse the shared form in edit mode */}
            <OpportunityForm
                mode="edit"
                initialData={opp}
                onSaved={(savedId) => router.push(`/opportunities/${savedId}`)}
            />
        </div>
    );
}
