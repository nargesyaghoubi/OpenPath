"use client";
// Reusable form component for creating and editing opportunities.
// Uses React Hook Form with Zod validation and supports both add and edit modes.

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useOpportunities } from "@/context/OpportunitiesContext";
import { categories } from "@/data/opportunities";
import { Opportunity } from "@/types";
import { CheckCircle2, Plus, Save } from "lucide-react";
import { cn } from "@/lib/utils";

// Shared validation schema used for both creating and editing an opportunity
const schema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    organization: z.string().min(2, "Organization required"),
    category: z.enum(["Job", "Internship", "Scholarship", "Online Course", "Remote Work", "Training Program", "Volunteer"]),
    country: z.string().min(2, "Country required"),
    location: z.string().min(2, "Location required"),
    type: z.enum(["Remote", "On-site", "Hybrid"]),
    deadline: z.string().min(1, "Deadline required"),
    description: z.string().min(30, "Description must be at least 30 characters"),
    requirements: z.string().min(5, "At least one requirement"),
    applyLink: z.string().url("Must be a valid URL"),
    tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface OpportunityFormProps {
    mode: "add" | "edit";
    initialData?: Opportunity;
    /** Called after a successful edit with the freshly saved opportunity (e.g. to navigate away) */
    onSaved?: (opportunity: Opportunity) => void;
}

// Turns an Opportunity record into the flat string-based shape the form fields use
function toFormValues(opp?: Opportunity): Partial<FormData> {
    if (!opp) return {};
    return {
        title: opp.title,
        organization: opp.organization,
        category: opp.category,
        country: opp.country,
        location: opp.location,
        type: opp.type,
        deadline: opp.deadline,
        description: opp.description,
        requirements: opp.requirements.join("\n"),
        applyLink: opp.applyLink,
        tags: opp.tags.join(", "),
    };
}

export default function OpportunityForm({ mode, initialData, onSaved }: OpportunityFormProps) {
    const t = useTranslations("addOpportunity");
    // Opportunity context actions
    const { addOpportunity, updateOpportunity } = useOpportunities();
    const [success, setSuccess] = useState(false);
    const [autoApproved, setAutoApproved] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: toFormValues(initialData),
    });
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Handle form submission for both creating and updating opportunities
    const onSubmit = async (data: FormData) => {
        setSubmitError(null);
        // Transform form values into the Opportunity model
        const payload = {
            title: data.title,
            organization: data.organization,
            category: data.category,
            country: data.country,
            countryCode: initialData?.countryCode ?? "GL",
            location: data.location,
            type: data.type,
            deadline: data.deadline,
            description: data.description,
            requirements: data.requirements.split("\n").map((s) => s.trim()).filter(Boolean),
            applyLink: data.applyLink,
            tags: data.tags ? data.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
            featured: initialData?.featured ?? false,
        };
        try {
            // Update an existing opportunity
            if (mode === "edit" && initialData) {
                const saved = await updateOpportunity(initialData.id, payload);
                onSaved?.(saved);
                return;
            }

            const created = await addOpportunity(payload);
            setAutoApproved(created.status === "APPROVED");
            setSuccess(true);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        }
    };

    // Add-mode success screen (edit mode navigates away instead, via onSaved)
    if (mode === "add" && success) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">{t("success")}</h2>
                <p className="text-neutral-500 dark:text-neutral-400 mb-5">
                    {autoApproved ? t("successApproved") : t("successPending")}
                </p>
                <button
                    onClick={() => { setSuccess(false); reset(); }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                    {t("reset")}
                </button>
            </div>
        );
    }
    // Shared styles for form controls
    const inputClass = "w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white dark:placeholder:text-neutral-500";
    const labelClass = "block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5";
    const errorClass = "text-xs text-red-500 mt-1";
    // Opportunity form UI
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className={labelClass}>{t("fields.title")} *</label>
                    <input {...register("title")} placeholder={t("fields.titlePlaceholder")} className={inputClass} />
                    {errors.title && <p className={errorClass}>{errors.title.message}</p>}
                </div>
                <div>
                    <label className={labelClass}>{t("fields.organization")} *</label>
                    <input {...register("organization")} placeholder={t("fields.organizationPlaceholder")} className={inputClass} />
                    {errors.organization && <p className={errorClass}>{errors.organization.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                    <label className={labelClass}>{t("fields.category")} *</label>
                    <select {...register("category")} className={inputClass} defaultValue={initialData?.category ?? ""}>
                        <option value="">Select...</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className={errorClass}>{errors.category.message}</p>}
                </div>
                <div>
                    <label className={labelClass}>{t("fields.country")} *</label>
                    <input {...register("country")} placeholder={t("fields.countryPlaceholder")} className={inputClass} />
                    {errors.country && <p className={errorClass}>{errors.country.message}</p>}
                </div>
                <div>
                    <label className={labelClass}>{t("fields.location")} *</label>
                    <input {...register("location")} placeholder={t("fields.locationPlaceholder")} className={inputClass} />
                    {errors.location && <p className={errorClass}>{errors.location.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className={labelClass}>{t("fields.type")} *</label>
                    <select {...register("type")} className={inputClass} defaultValue={initialData?.type ?? ""}>
                        <option value="">Select...</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                    {errors.type && <p className={errorClass}>{errors.type.message}</p>}
                </div>
                <div>
                    <label className={labelClass}>{t("fields.deadline")} *</label>
                    <input type="date" {...register("deadline")} className={inputClass} />
                    {errors.deadline && <p className={errorClass}>{errors.deadline.message}</p>}
                </div>
            </div>

            <div>
                <label className={labelClass}>{t("fields.description")} *</label>
                <textarea {...register("description")} rows={4} placeholder={t("fields.descriptionPlaceholder")} className={cn(inputClass, "resize-none")} />
                {errors.description && <p className={errorClass}>{errors.description.message}</p>}
            </div>

            <div>
                <label className={labelClass}>{t("fields.requirements")} *</label>
                <textarea {...register("requirements")} rows={3} placeholder={t("fields.requirementsPlaceholder")} className={cn(inputClass, "resize-none")} />
                {errors.requirements && <p className={errorClass}>{errors.requirements.message}</p>}
            </div>

            <div>
                <label className={labelClass}>{t("fields.applyLink")} *</label>
                <input {...register("applyLink")} placeholder={t("fields.applyLinkPlaceholder")} className={inputClass} />
                {errors.applyLink && <p className={errorClass}>{errors.applyLink.message}</p>}
            </div>

            <div>
                <label className={labelClass}>{t("fields.tags")}</label>
                <input {...register("tags")} placeholder={t("fields.tagsPlaceholder")} className={inputClass} />
            </div>

            {submitError && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    ⚠️ {submitError}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                    "w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                )}
            >
                {mode === "edit" ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isSubmitting
                    ? t("submitting")
                    : mode === "edit" ? "Save Changes" : t("submit")}
            </button>
        </form>
    );
}
