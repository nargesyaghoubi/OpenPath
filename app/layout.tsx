import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        template: "%s | OpenPath",
        default: "OpenPath — Global Opportunity Finder",
    },
    description: "Connecting people worldwide with jobs, scholarships, internships, and skill-building opportunities.",
    icons: {
        icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌍</text></svg>",
    },
};

// Root layout renders NO <html> or <body> —
// those come from the [locale]/layout.tsx which knows lang + dir.
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children;
}
