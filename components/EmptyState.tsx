import { Link } from "@/lib/i18n/navigation";
import { LucideIcon } from "lucide-react";

// Empty state component props
interface EmptyStateProps {
    icon?: LucideIcon | string;
    title: string;
    subtitle?: string;
    action?: {
        label: string;
        href: string;
    };
}

export default function EmptyState({ icon: Icon, title, subtitle, action }: EmptyStateProps) {
    return (
        // Empty state container 
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-5">
                {typeof Icon === "string" ? (
                    <span className="text-3xl">{Icon}</span>
                ) : Icon ? (
                    <Icon className="w-8 h-8 text-neutral-400" />
                ) : (
                    <span className="text-3xl">🔍</span>
                )}
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{title}</h3>
            {subtitle && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm">{subtitle}</p>
            )}
            {action && (
                <Link
                    href={action.href}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                    {action.label}
                </Link>
            )}
        </div>
    );
}
