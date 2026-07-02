import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { isRTL } from "@/lib/utils";
import { ThemeProvider, ThemeScript } from "@/components/ThemeProvider";
import { SavedProvider } from "@/context/SavedContext";
import { OpportunitiesProvider } from "@/context/OpportunitiesContext";
import ClientLayout from "@/components/ClientLayout";

// Application metadata for SEO and browser title
export const metadata: Metadata = {
    title: {
        template: "%s | OpenPath",
        default: "OpenPath — Global Opportunity Finder",
    },
    description:
        "Connecting people worldwide with jobs, scholarships, internships, and skill-building opportunities.",
};
// Generate static routes for all supported locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    // Return 404 if the requested locale is not supported
    if (!routing.locales.includes(locale as typeof routing.locales[number])) {
        notFound();
    }
    // Load translation messages and determine text direction
    const messages = await getMessages();
    const rtl = isRTL(locale);

    // This is the ONE AND ONLY <html> in the tree.
    // Root layout (app/layout.tsx) intentionally returns `children` only.
    return (
        <html lang={locale} dir={rtl ? "rtl" : "ltr"} suppressHydrationWarning data-scroll-behavior="smooth">
            <body>
                {/* Apply theme before hydration */}
                <ThemeScript />
                {/* Global application providers */}
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider>
                        <OpportunitiesProvider>
                            <SavedProvider>
                                <ClientLayout>{children}</ClientLayout>
                            </SavedProvider>
                        </OpportunitiesProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
