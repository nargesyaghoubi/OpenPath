"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { Plus, Trash2, Download, Loader2, FileText, GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

// Validation schema 
const educationSchema = z.object({
    school: z.string().min(1, "Required"),
    degree: z.string().min(1, "Required"),
    year: z.string().min(1, "Required"),
});

const experienceSchema = z.object({
    company: z.string().min(1, "Required"),
    role: z.string().min(1, "Required"),
    period: z.string().min(1, "Required"),
    description: z.string(),
});

const schema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email required"),
    phone: z.string(),
    location: z.string(),
    summary: z.string().max(600, "Keep the summary under 600 characters"),
    skills: z.string(),
    education: z.array(educationSchema),
    experience: z.array(experienceSchema),
});

type CVFormData = z.infer<typeof schema>;

const defaultValues: CVFormData = {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: "",
    education: [{ school: "", degree: "", year: "" }],
    experience: [{ company: "", role: "", period: "", description: "" }],
};

// Labels that need to appear inside the generated PDF itself, translated to
// match whatever language the CV Builder page is currently in.
interface PdfLabels {
    yourName: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
}

// PDF document (built on-demand inside handleDownload, never rendered to DOM directly) 
const pdfStyles = StyleSheet.create({
    page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#1f2937" },
    name: { fontSize: 22, fontWeight: 700, marginBottom: 2 },
    contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14, color: "#4b5563" },
    sectionTitle: {
        fontSize: 12, fontWeight: 700, marginBottom: 6, marginTop: 14,
        borderBottomWidth: 1, borderBottomColor: "#e5e7eb", borderBottomStyle: "solid",
        paddingBottom: 3, textTransform: "uppercase", color: "#4338ca",
    },
    summaryText: { lineHeight: 1.5, color: "#374151" },
    entry: { marginBottom: 8 },
    entryHeader: { flexDirection: "row", justifyContent: "space-between" },
    entryTitle: { fontWeight: 700 },
    entrySub: { color: "#6b7280", marginTop: 1 },
    entryDesc: { color: "#374151", marginTop: 2, lineHeight: 1.4 },
    skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    skillPill: {
        backgroundColor: "#eef2ff", color: "#4338ca", paddingVertical: 3, paddingHorizontal: 8,
        borderRadius: 4, fontSize: 9,
    },
});

function ResumeDocument({ data, labels }: { data: CVFormData; labels: PdfLabels }) {
    const skills = (data.skills ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const contactParts = [data.email, data.phone, data.location].filter(Boolean);

    return (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                <Text style={pdfStyles.name}>{data.fullName || labels.yourName}</Text>
                <View style={pdfStyles.contactRow}>
                    {contactParts.map((part, i) => (
                        <Text key={i}>{part}{i < contactParts.length - 1 ? "  •  " : ""}</Text>
                    ))}
                </View>

                {data.summary && (
                    <>
                        <Text style={pdfStyles.sectionTitle}>{labels.summary}</Text>
                        <Text style={pdfStyles.summaryText}>{data.summary}</Text>
                    </>
                )}

                {data.experience.some((e) => e.company || e.role) && (
                    <>
                        <Text style={pdfStyles.sectionTitle}>{labels.experience}</Text>
                        {data.experience.filter((e) => e.company || e.role).map((e, i) => (
                            <View key={i} style={pdfStyles.entry}>
                                <View style={pdfStyles.entryHeader}>
                                    <Text style={pdfStyles.entryTitle}>{e.role}{e.company ? ` — ${e.company}` : ""}</Text>
                                    <Text style={pdfStyles.entrySub}>{e.period}</Text>
                                </View>
                                {e.description && <Text style={pdfStyles.entryDesc}>{e.description}</Text>}
                            </View>
                        ))}
                    </>
                )}

                {data.education.some((e) => e.school || e.degree) && (
                    <>
                        <Text style={pdfStyles.sectionTitle}>{labels.education}</Text>
                        {data.education.filter((e) => e.school || e.degree).map((e, i) => (
                            <View key={i} style={pdfStyles.entry}>
                                <View style={pdfStyles.entryHeader}>
                                    <Text style={pdfStyles.entryTitle}>{e.degree}{e.school ? ` — ${e.school}` : ""}</Text>
                                    <Text style={pdfStyles.entrySub}>{e.year}</Text>
                                </View>
                            </View>
                        ))}
                    </>
                )}

                {skills.length > 0 && (
                    <>
                        <Text style={pdfStyles.sectionTitle}>{labels.skills}</Text>
                        <View style={pdfStyles.skillsRow}>
                            {skills.map((s, i) => <Text key={i} style={pdfStyles.skillPill}>{s}</Text>)}
                        </View>
                    </>
                )}
            </Page>
        </Document>
    );
}

// Main builder UI: form on the left, live HTML preview on the right 
export default function CVBuilder() {
    const t = useTranslations("cvBuilder");
    const [isGenerating, setIsGenerating] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<CVFormData>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const education = useFieldArray({ control, name: "education" });
    const experience = useFieldArray({ control, name: "experience" });
    const liveData = watch();

    const inputClass = "w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white dark:placeholder:text-neutral-500";
    const labelClass = "block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1";
    const errorClass = "text-xs text-red-500 mt-1";

    const onSubmit = async (data: CVFormData) => {
        setDownloadError(null);
        setIsGenerating(true);
        try {
            // Generated fully client-side inside this event handler, so there's
            // no server round-trip and no SSR concerns with @react-pdf/renderer.
            const labels: PdfLabels = {
                yourName: t("yourName"),
                summary: t("summary"),
                experience: t("experience"),
                education: t("education"),
                skills: t("skills").replace(/\s*\(.*\)\s*$/, ""), // strip "(comma separated)" for the PDF heading
            };
            const blob = await pdf(<ResumeDocument data={data} labels={labels} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${(data.fullName || "resume").replace(/\s+/g, "_")}_CV.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            setDownloadError(t("downloadError"));
        } finally {
            setIsGenerating(false);
        }
    };

    const skillsPreview = (liveData.skills ?? "").split(",").map((s) => s.trim()).filter(Boolean);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form column */}
            <div className="space-y-5">
                {/* Personal info */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
                    <h2 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" /> {t("personalDetails")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>{t("fullName")} *</label>
                            <input {...register("fullName")} placeholder={t("fullNamePlaceholder")} className={inputClass} />
                            {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>{t("email")} *</label>
                            <input {...register("email")} placeholder={t("emailPlaceholder")} className={inputClass} />
                            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>{t("phone")}</label>
                            <input {...register("phone")} placeholder={t("phonePlaceholder")} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>{t("location")}</label>
                            <input {...register("location")} placeholder={t("locationPlaceholder")} className={inputClass} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className={labelClass}>{t("summary")}</label>
                        <textarea {...register("summary")} rows={3} placeholder={t("summaryPlaceholder")} className={cn(inputClass, "resize-none")} />
                        {errors.summary && <p className={errorClass}>{errors.summary.message}</p>}
                    </div>
                    <div className="mt-4">
                        <label className={labelClass}>{t("skills")}</label>
                        <input {...register("skills")} placeholder={t("skillsPlaceholder")} className={inputClass} />
                    </div>
                </div>

                {/* Experience */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-indigo-500" /> {t("experience")}
                        </h2>
                        <button
                            type="button"
                            onClick={() => experience.append({ company: "", role: "", period: "", description: "" })}
                            className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            <Plus className="w-3.5 h-3.5" /> {t("add")}
                        </button>
                    </div>
                    <div className="space-y-4">
                        {experience.fields.map((field, i) => (
                            <div key={field.id} className="border border-neutral-100 dark:border-neutral-800 rounded-xl p-3.5 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input {...register(`experience.${i}.role`)} placeholder={t("rolePlaceholder")} className={inputClass} />
                                    <input {...register(`experience.${i}.company`)} placeholder={t("companyPlaceholder")} className={inputClass} />
                                </div>
                                <input {...register(`experience.${i}.period`)} placeholder={t("periodPlaceholder")} className={inputClass} />
                                <textarea {...register(`experience.${i}.description`)} rows={2} placeholder={t("descriptionPlaceholder")} className={cn(inputClass, "resize-none")} />
                                {experience.fields.length > 1 && (
                                    <button type="button" onClick={() => experience.remove(i)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                        <Trash2 className="w-3 h-3" /> {t("remove")}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-indigo-500" /> {t("education")}
                        </h2>
                        <button
                            type="button"
                            onClick={() => education.append({ school: "", degree: "", year: "" })}
                            className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            <Plus className="w-3.5 h-3.5" /> {t("add")}
                        </button>
                    </div>
                    <div className="space-y-4">
                        {education.fields.map((field, i) => (
                            <div key={field.id} className="border border-neutral-100 dark:border-neutral-800 rounded-xl p-3.5 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input {...register(`education.${i}.degree`)} placeholder={t("degreePlaceholder")} className={inputClass} />
                                    <input {...register(`education.${i}.school`)} placeholder={t("schoolPlaceholder")} className={inputClass} />
                                </div>
                                <input {...register(`education.${i}.year`)} placeholder={t("yearPlaceholder")} className={inputClass} />
                                {education.fields.length > 1 && (
                                    <button type="button" onClick={() => education.remove(i)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                        <Trash2 className="w-3 h-3" /> {t("remove")}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {downloadError && (
                    <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                        ⚠️ {downloadError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isGenerating}
                    className={cn(
                        "w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2",
                        isGenerating && "opacity-70 cursor-not-allowed"
                    )}
                >
                    {isGenerating ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {t("generating")}</>
                    ) : (
                        <><Download className="w-4 h-4" /> {t("download")}</>
                    )}
                </button>
            </div>

            {/* Live preview column */}
            <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{liveData.fullName || t("yourName")}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {[liveData.email, liveData.phone, liveData.location].filter(Boolean).join("  •  ")}
                    </p>

                    {liveData.summary && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mt-4">{liveData.summary}</p>
                    )}

                    {liveData.experience?.some((e) => e.company || e.role) && (
                        <div className="mt-5">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-neutral-200 dark:border-neutral-800 pb-1.5 mb-2.5">{t("experience")}</h4>
                            <div className="space-y-3">
                                {liveData.experience.filter((e) => e.company || e.role).map((e, i) => (
                                    <div key={i}>
                                        <div className="flex items-baseline justify-between text-sm">
                                            <span className="font-medium text-neutral-900 dark:text-white">{e.role}{e.company ? ` — ${e.company}` : ""}</span>
                                            <span className="text-xs text-neutral-400">{e.period}</span>
                                        </div>
                                        {e.description && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{e.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {liveData.education?.some((e) => e.school || e.degree) && (
                        <div className="mt-5">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-neutral-200 dark:border-neutral-800 pb-1.5 mb-2.5">{t("education")}</h4>
                            <div className="space-y-2">
                                {liveData.education.filter((e) => e.school || e.degree).map((e, i) => (
                                    <div key={i} className="flex items-baseline justify-between text-sm">
                                        <span className="font-medium text-neutral-900 dark:text-white">{e.degree}{e.school ? ` — ${e.school}` : ""}</span>
                                        <span className="text-xs text-neutral-400">{e.year}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {skillsPreview.length > 0 && (
                        <div className="mt-5">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-neutral-200 dark:border-neutral-800 pb-1.5 mb-2.5">{t("skills").replace(/\s*\(.*\)\s*$/, "")}</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {skillsPreview.map((s, i) => (
                                    <span key={i} className="text-xs px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-md">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-3 text-center">
                    {t("livePreviewNote")}
                </p>
            </div>
        </form>
    );
}
