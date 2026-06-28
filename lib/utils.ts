import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDeadline(deadline: string): string {
  const date = new Date(deadline);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isExpiringSoon(deadline: string, daysThreshold = 14): boolean {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= daysThreshold;
}

export function isExpired(deadline: string): boolean {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return deadlineDate < now;
}

export function getDaysRemaining(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const CATEGORY_COLORS: Record<string, string> = {
  Job: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Internship: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  Scholarship: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Online Course": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Remote Work": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Training Program": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Volunteer: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
};

export const CATEGORY_ICONS: Record<string, string> = {
  Job: "💼",
  Internship: "🎓",
  Scholarship: "🏆",
  "Online Course": "💻",
  "Remote Work": "🌐",
  "Training Program": "📚",
  Volunteer: "🤝",
};

export const RTL_LOCALES = ["fa", "ar"];

export function isRTL(locale: string): boolean {
  return RTL_LOCALES.includes(locale);
}

export const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  fa: "فارسی",
  ar: "العربية",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
};

export const LOCALE_FLAGS: Record<string, string> = {
  en: "🇬🇧",
  fa: "🇦🇫",
  ar: "🇸🇦",
  fr: "🇫🇷",
  es: "🇪🇸",
  de: "🇩🇪",
};
