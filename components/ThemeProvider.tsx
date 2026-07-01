"use client";

import { createContext, useContext, useEffect, useState } from "react";
// Supported application themes
type Theme = "light" | "dark";

// Theme context with default values
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
    theme: "light",
    toggleTheme: () => { },
});
// Inline script executed before React hydration to prevent
// a flash of the wrong theme on the initial page load.
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem("openpath_theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored || (prefersDark ? "dark" : "light");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch(e) {}
})();
`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Initialize theme state after hydration
    const [theme, setTheme] = useState<Theme>("light");
    // Prevent hydration mismatch before the initial theme is resolved
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");
        setMounted(true);
    }, []);

    // Toggle between light and dark themes and persist the preference
    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        localStorage.setItem("openpath_theme", next);
        if (next === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <ThemeContext.Provider value={{ theme: mounted ? theme : "light", toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
// Inject the theme initialization script before React renders
export function ThemeScript() {
    return (
        <script
            dangerouslySetInnerHTML={{ __html: themeScript }}
            suppressHydrationWarning
        />
    );
}

export const useTheme = () => useContext(ThemeContext);
