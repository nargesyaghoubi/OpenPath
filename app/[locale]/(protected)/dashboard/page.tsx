// Protected dashboard page.
// Performs authentication and locale setup on the server,
// while rendering the interactive dashboard in a client component.

import { auth } from "@/auth";
import { getLocale } from "next-intl/server";
import { isRTL } from "@/lib/utils";
import DashboardContent from "@/components/DashboardContent";

export default async function DashboardPage() {
    // Get the authenticated user session
    const session = await auth();
    // Resolve locale and text direction
    const locale = await getLocale();
    const rtl = isRTL(locale);

    const user = session!.user as { name: string; email: string; role?: string };

    return (
        <div dir={rtl ? "rtl" : "ltr"} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <DashboardContent user={user} />
        </div>
    );
}
