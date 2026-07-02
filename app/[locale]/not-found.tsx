import { Link } from "@/lib/i18n/navigation";

export default function NotFound() {
    return (
        // Center the 404 content on the page
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            {/* Error illustration */}
            <div className="text-8xl mb-6">🔍</div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3">404</h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8">Page not found</p>
            {/* Navigate back to the homepage */}
            <Link
                href="/"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
}
