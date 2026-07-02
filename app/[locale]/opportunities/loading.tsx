export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Page header skeleton */}
            <div className="h-8 w-56 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-2 animate-pulse" />
            <div className="h-4 w-80 bg-neutral-100 dark:bg-neutral-800 rounded mb-8 animate-pulse" />
            {/* Search and filter skeleton */}
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-8 animate-pulse" />
            {/* Opportunity card skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-neutral-200 dark:bg-neutral-800 rounded-2xl h-64 animate-pulse" />
                ))}
            </div>
        </div>
    );
}
