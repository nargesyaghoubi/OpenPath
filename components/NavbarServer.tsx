import { auth } from "@/auth";
import { getLocale } from "next-intl/server";
import NavbarClient from "./NavbarClient";

// Server component responsible for fetching session and locale
export default async function NavbarServer({ theme, toggleTheme }: { theme?: string; toggleTheme?: () => void }) {
    // Get the current authenticated session
    const session = await auth();
    // Get the active locale from the request
    const locale = await getLocale();
    
    // Normalize user data before passing it to the client component
    const user = session?.user
        ? {
            name: session.user.name ?? "User",
            email: session.user.email ?? "",
            role: (session.user as { role?: string }).role ?? "user",
        }
        : null;

    return <NavbarClient user={user} locale={locale} />;
}
