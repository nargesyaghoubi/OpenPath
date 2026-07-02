"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { isRTL, cn } from "@/lib/utils";
import { Mail, MapPin, CheckCircle2, Send } from "lucide-react";

// Validation schema for the contact form
const schema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Valid email required"),
    subject: z.string().min(3, "Subject required"),
    message: z.string().min(20, "Message must be at least 20 characters"),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
    const t = useTranslations("contact");
    const locale = useLocale();
    const rtl = isRTL(locale);
    const [success, setSuccess] = useState(false);
    // Initialize React Hook Form with Zod validation
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    // Simulate form submission and show success message
    const onSubmit = async () => {
        await new Promise((r) => setTimeout(r, 700));
        setSuccess(true);
        reset();
    };

    const inputClass = "w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white dark:placeholder:text-neutral-500";
    const labelClass = "block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5";

    return (
        <div dir={rtl ? "rtl" : "ltr"} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Page header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white mb-4">{t("title")}</h1>
                <p className="text-neutral-500 dark:text-neutral-400">{t("subtitle")}</p>
                <div className="w-16 h-1 bg-indigo-500 rounded-full mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info */}
                <div className="space-y-5">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                        <h2 className="font-bold text-neutral-900 dark:text-white mb-5">{t("info.title")}</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                <span>{t("info.email")}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                <span>{t("info.location")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-600 rounded-2xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">OpenPath</h3>
                        <p className="text-sm text-indigo-100">Connecting youth with life-changing opportunities.</p>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-7">
                    {/* Success state after form submission */}
                    {success ? (
                        <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                            <CheckCircle2 className="w-12 h-12 text-indigo-500 mb-4" />
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{t("success")}</h3>
                            <button onClick={() => setSuccess(false)} className="text-sm text-indigo-600 hover:underline">
                                Send another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Name and email fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>{t("fields.name")} *</label>
                                    <input {...register("name")} placeholder={t("fields.namePlaceholder")} className={inputClass} />
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>{t("fields.email")} *</label>
                                    <input type="email" {...register("email")} placeholder={t("fields.emailPlaceholder")} className={inputClass} />
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>{t("fields.subject")} *</label>
                                <input {...register("subject")} placeholder={t("fields.subjectPlaceholder")} className={inputClass} />
                                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>{t("fields.message")} *</label>
                                <textarea {...register("message")} rows={5} placeholder={t("fields.messagePlaceholder")} className={cn(inputClass, "resize-none")} />
                                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={cn(
                                    "w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2",
                                    isSubmitting && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                <Send className="w-4 h-4" />
                                {isSubmitting ? t("submitting") : t("submit")}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
