"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { CATEGORY_ICONS, isRTL } from "@/lib/utils";
import { opportunities, categories } from "@/data/opportunities";
import OpportunityCard from "@/components/OpportunityCard";
import { ArrowRight, Briefcase, Users, Tag, Globe2 } from "lucide-react";

// Framer Motion variants
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
};

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
    const t = useTranslations("home");
    const locale = useLocale();
    const rtl = isRTL(locale);
    // Get featured opportunities for the homepage section
    const featured = opportunities.filter((o) => o.featured).slice(0, 4);
    // Statistics displayed in the hero section
    const stats = [
        { label: t("hero.stats.opportunities"), value: opportunities.length, icon: Briefcase },
        { label: t("hero.stats.organizations"), value: 18, icon: Users },
        { label: t("hero.stats.categories"), value: categories.length, icon: Tag },
        { label: t("hero.stats.countries"), value: 8, icon: Globe2 },
    ];

    return (
        <div dir={rtl ? "rtl" : "ltr"}>
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-400 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    {/* Primary call-to-action buttons */}
                    <motion.div className="max-w-3xl" initial="hidden" animate="visible" variants={stagger}>
                        <motion.span variants={fadeUp} custom={0}
                            className="inline-block px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 mb-6">
                            {t("hero.badge")}
                        </motion.span>

                        <motion.h1 variants={fadeUp} custom={1}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                            {t("hero.title")}{" "}
                            <span className="text-indigo-400">{t("hero.titleHighlight")}</span>
                        </motion.h1>

                        <motion.p variants={fadeUp} custom={2}
                            className="text-lg sm:text-xl text-indigo-100/80 mb-8 max-w-2xl leading-relaxed">
                            {t("hero.subtitle")}
                        </motion.p>
                        {/* Platform statistics cards */}
                        <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
                            <Link href="/opportunities"
                                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-colors flex items-center gap-2">
                                {t("hero.browseBtn")} <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/add-opportunity"
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors">
                                {t("hero.addBtn")}
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4"
                        initial="hidden" animate="visible" variants={stagger}>
                        {stats.map((stat, i) => (
                            <motion.div key={stat.label} variants={fadeUp} custom={i + 4}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <stat.icon className="w-5 h-5 text-indigo-400 mb-2" />
                                <div className="text-2xl font-bold text-white">{stat.value}+</div>
                                <div className="text-sm text-indigo-200/70">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{t("categories.title")}</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-1">{t("categories.subtitle")}</p>
                    </div>
                    <Link href="/opportunities"
                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                        {t("categories.viewAll")} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </motion.div>

                <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3"
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                    {categories.map((cat, i) => {
                        const count = opportunities.filter((o) => o.category === cat).length;
                        return (
                            <motion.div key={cat} variants={fadeUp} custom={i}>
                                <Link href={`/opportunities?category=${encodeURIComponent(cat)}`}
                                    className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 transition-all text-center group">
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{CATEGORY_ICONS[cat]}</span>
                                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 leading-tight">{cat}</span>
                                    <span className="text-xs text-neutral-400">{count}</span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            {/* Featured */}
            <section className="bg-neutral-100 dark:bg-neutral-900/50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{t("featured.title")}</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 mt-1">{t("featured.subtitle")}</p>
                        </div>
                        <Link href="/opportunities"
                            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                            {t("featured.viewAll")} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </motion.div>

                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        {featured.map((opp, i) => (
                            <motion.div key={opp.id} variants={fadeUp} custom={i}>
                                <OpportunityCard opportunity={opp} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Call-to-action encouraging users to share new opportunities */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-3xl p-10 text-center text-white">
                    <h2 className="text-3xl font-bold mb-3">{t("cta.title")}</h2>
                    <p className="text-indigo-100 mb-7 max-w-lg mx-auto">{t("cta.subtitle")}</p>
                    <Link href="/add-opportunity"
                        className="inline-flex items-center gap-2 px-7 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
                        {t("cta.btn")} <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
