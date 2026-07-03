// Page for building and exporting a professional CV.
import { getLocale, getTranslations } from "next-intl/server";
import { isRTL } from "@/lib/utils";
import { FileText } from "lucide-react";
import CVBuilder from "@/components/CVBuilder";

export default async function CVBuilderPage() {
    const locale = await getLocale();
    const rtl = isRTL(locale);
    const t = await getTranslations("cvBuilder");
    // CV builder page layout
    return (
        <div dir={rtl ? "rtl" : "ltr"} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-3">
                    <FileText className="w-7 h-7 text-indigo-500" /> {t("title")}
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    {t("subtitle")}
                </p>
            </div>
            {/* Interactive CV builder */}
            <CVBuilder />
        </div>
    );
}