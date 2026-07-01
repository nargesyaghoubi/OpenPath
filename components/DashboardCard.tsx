import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

// Dashboard card component props
interface DashboardCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    color: "indigo" | "blue" | "green" | "cyan" | "orange" | "red";
    trend?: string;
}

// Color variants for dashboard cards
const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",

    green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export default function DashboardCard({ title, value, icon: Icon, color, trend }: DashboardCardProps) {
    return (

        //Dashboard statistic card 
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:shadow-md transition-shadow">
            {/* Card content */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
                    {/* Trend indicator */}
                    {trend && (
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{trend}</p>
                    )}
                </div>
                <div className={cn("p-3 rounded-xl", colorMap[color])}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
