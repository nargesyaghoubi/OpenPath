import { auth } from "./auth";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// Routes (WITHOUT locale prefix) that require authentication
const protectedPaths = [
    "/dashboard",
    "/saved",
    "/add-opportunity",
    "/edit-opportunity",
    "/cv-builder",
];

const intlMiddleware = createIntlMiddleware(routing);

// Combine next-intl + Auth.js in a single proxy function (Next.js 16 style)
export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Strip locale prefix to get the base path
    // e.g. /en/dashboard → /dashboard, /fa/saved → /saved
    const localePattern = new RegExp(
        `^\\/(${routing.locales.join("|")})(\\/.*)$`
    );
    const match = pathname.match(localePattern);
    const basePath = match ? match[2] : pathname;

    const isProtected = protectedPaths.some(
        (p) => basePath === p || basePath.startsWith(p + "/")
    );

    if (isProtected) {
        const session = await auth();

        if (!session?.user) {
            // Detect locale for the redirect
            const locale = match ? match[1] : routing.defaultLocale;
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Let next-intl handle locale routing for everything else
    return intlMiddleware(request);
}

export const config = {
    // Apply proxy to all pages, skip static files and API routes
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
