import NavbarServer from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";

// Client layout wrapper
export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthSessionProvider>
            <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
                {/* Global navigation */}
                <NavbarServer />
                {/* Page content */}
                <main className="flex-1">{children}</main>
                {/* Global footer */}
                <Footer />
            </div>
        </AuthSessionProvider>
    );
}
