// Checks authentication before rendering children
// Redirects to login if user is not authenticated

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const locale = await getLocale();

    if (!session?.user) {
        redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard`);
    }

    // Children already have Navbar/Footer from the locale layout
    return <>{children}</>;
}
