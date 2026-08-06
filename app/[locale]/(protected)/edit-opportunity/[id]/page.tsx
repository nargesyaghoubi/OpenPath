"use client";
// Client page for editing an existing opportunity.
// Fetches the opportunity directly from the API (not the public
// OpportunitiesContext) so owners can also edit a PENDING/REJECTED
// submission that isn't in the public approved feed yet.
import { use, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { isRTL } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Pencil, Loader2 } from "lucide-react";
import OpportunityForm from "@/components/OpportunityForm";
import { Opportunity } from "@/types";

export default function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const t = useTranslations("addOpportunity");
    const locale = useLocale();
    const rtl = isRTL(locale);
    const router = useRouter();

    const [opp, setOpp] = useState<Opportunity | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFoundState, setNotFoundState] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/opportunities/${id}`, { cache: "no-store" });
                if (res.status === 404 || res.status === 403) {
                    if (!cancelled) setNotFoundState(true);
                    return;
                }
                if (!res.ok) throw new Error("Failed to load opportunity");
                const data = await res.json();
                if (!cancelled) setOpp(data.opportunity);
            } catch {
                if (!cancelled) setNotFoundState(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    if (notFoundState) return notFound();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24 text-neutral-400">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }
    if (!opp) return notFound();

    return (
        <div dir={rtl ? "rtl" : "ltr"} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-3">
                    <Pencil className="w-7 h-7 text-indigo-500" /> Edit Opportunity
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">{t("subtitle")}</p>
                {opp.status && opp.status !== "APPROVED" && (
                    <p className="mt-2 text-xs inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        Status: {opp.status}{opp.rejectReason ? ` — ${opp.rejectReason}` : ""}
                    </p>
                )}
            </div>
            <OpportunityForm
                mode="edit"
                initialData={opp}
                onSaved={(saved) =>
                    router.push(saved.status === "APPROVED" ? `/opportunities/${saved.id}` : "/dashboard")
                }
            />
        </div>
    );
}