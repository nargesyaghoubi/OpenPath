import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
    reactStrictMode: true,
    // Next.js 16: proxy.ts replaces middleware.ts
    // cacheComponents: true, // uncomment to enable PPR Cache Components
};

export default withNextIntl(nextConfig);
