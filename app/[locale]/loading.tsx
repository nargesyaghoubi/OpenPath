export default function Loading() {
    return (
        // Center the loading indicator on the page
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                {/* Animated loading spinner */}
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading...</p>
            </div>
        </div>
    );
}
