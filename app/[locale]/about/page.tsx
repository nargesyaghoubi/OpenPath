import { useTranslations, useLocale } from "next-intl";
import { isRTL } from "@/lib/utils";
import { Globe, Users, ShieldCheck } from "lucide-react";

export default function AboutPage() {
    const t = useTranslations("about");
    const locale = useLocale();
    const rtl = isRTL(locale);

    return (

        // About page container 
        <div
            dir={rtl ? "rtl" : "ltr"}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
            {/* Page header */}
            <div className="text-center mb-14">
                <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white mb-4">
                    {t("title")}
                </h1>
                <div className="w-16 h-1 bg-indigo-500 rounded-full mx-auto" />
            </div>
            {/* Mission, problem, and solution sections */}
            <div className="space-y-8">
                {[
                    { key: "mission", emoji: "🎯" },
                    { key: "problem", emoji: "🔍" },
                    { key: "solution", emoji: "💡" },
                ].map(({ key, emoji }) => (
                    <div
                        key={key}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-7"
                    >
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                            <span>{emoji}</span> {t(`${key}.title` as any)}
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            {t(`${key}.text` as any)}
                        </p>
                    </div>
                ))}

                {/* Values */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-7">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                        🌟 {t("values.title")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {[
                            {
                                icon: Globe,
                                title: t("values.access"),
                                text: t("values.accessText"),
                                color: "indigo",
                            },
                            {
                                icon: Users,
                                title: t("values.inclusion"),
                                text: t("values.inclusionText"),
                                color: "blue",
                            },
                            {
                                icon: ShieldCheck,
                                title: t("values.transparency"),
                                text: t("values.transparencyText"),
                                color: "indigo",
                            },
                        ].map(({ icon: Icon, title, text, color }) => (
                            <div
                                key={title}
                                className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
                            >
                                <Icon className={`w-6 h-6 text-${color}-500 mb-3`} />
                                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                                    {title}
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Demo note */}
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
                    ⚠️ {t("demoNote")}
                </div>
            </div>
        </div>
    );
}
