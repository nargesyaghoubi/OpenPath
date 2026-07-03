"use client";
// Live countdown timer for opportunity application deadlines.
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
    deadline: string;
    className?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}
// Calculate the remaining time until the application deadline
function getTimeLeft(deadline: string): TimeLeft {
    const total = new Date(deadline).getTime() - Date.now();
    if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return { days, hours, minutes, seconds, total };
}

// Live-updating countdown to an opportunity's application deadline.
// Ticks every second; automatically flips to an "Expired" state.
export default function CountdownTimer({ deadline, className }: CountdownTimerProps) {
    // Start as null so the very first render matches the server (avoids
    // a hydration mismatch from Date.now() differing between server/client)
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    // Update the countdown every second
    useEffect(() => {
        setTimeLeft(getTimeLeft(deadline));
        const interval = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000);
        return () => clearInterval(interval);
    }, [deadline]);

    // Show a placeholder until the countdown is initialized on the client
    if (!timeLeft) {
        // Skeleton while we wait for the client-only first tick
        return <div className={cn("h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse", className)} />;
    }

    if (timeLeft.total <= 0) {
        return (
            <div className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm font-medium",
                className
            )}>
                <Clock className="w-4 h-4" /> Application deadline has passed
            </div>
        );
    }

    const urgent = timeLeft.days < 3;
    // Time units displayed in the countdown
    const units: { label: string; value: number }[] = [
        { label: "Days", value: timeLeft.days },
        { label: "Hrs", value: timeLeft.hours },
        { label: "Min", value: timeLeft.minutes },
        { label: "Sec", value: timeLeft.seconds },
    ];
    // Countdown timer UI
    return (
        <div className={cn(
            "rounded-xl p-4 border",
            urgent
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                : "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800",
            className
        )}>
            <p className={cn(
                "flex items-center gap-1.5 text-xs font-medium mb-2 uppercase tracking-wider",
                urgent ? "text-red-600 dark:text-red-400" : "text-indigo-600 dark:text-indigo-400"
            )}>
                <Clock className="w-3.5 h-3.5" /> Time left to apply
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
                {units.map((u) => (
                    <div key={u.label}>
                        <div className={cn(
                            "text-xl font-bold tabular-nums",
                            urgent ? "text-red-700 dark:text-red-300" : "text-indigo-700 dark:text-indigo-300"
                        )}>
                            {String(u.value).padStart(2, "0")}
                        </div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase">{u.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
