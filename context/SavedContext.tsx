"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Opportunity } from "@/types";

// Type definition for all available saved context operations
interface SavedContextType {
    savedIds: string[];
    savedOpportunities: Opportunity[];
    toggleSave: (opportunity: Opportunity) => void;
    isSaved: (id: string) => boolean;
    clearAll: () => void;
}

const SavedContext = createContext<SavedContextType | null>(null);

// Key used to persist saved opportunities in localStorage
const STORAGE_KEY = "kaaryab_saved_opportunities";

export function SavedProvider({ children }: { children: ReactNode }) {
    // Stores only the ids of saved opportunities
    const [savedIds, setSavedIds] = useState<string[]>([]);
    // Stores the full opportunity objects for display
    const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);

    // On mount, restore saved opportunities from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setSavedIds(parsed.ids || []);
                setSavedOpportunities(parsed.opportunities || []);
            }
        } catch {
            // Ignore parse errors and start with empty state
        }
    }, []);

    // Syncs both ids and full objects to localStorage
    const persist = (ids: string[], opps: Opportunity[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ids, opportunities: opps }));
    };

    // Saves or unsaves an opportunity depending on current state
    const toggleSave = (opportunity: Opportunity) => {
        if (savedIds.includes(opportunity.id)) {
            // Remove from saved
            const newIds = savedIds.filter((id) => id !== opportunity.id);
            const newOpps = savedOpportunities.filter((o) => o.id !== opportunity.id);
            setSavedIds(newIds);
            setSavedOpportunities(newOpps);
            persist(newIds, newOpps);
        } else {
            // Add to saved
            const newIds = [...savedIds, opportunity.id];
            const newOpps = [...savedOpportunities, opportunity];
            setSavedIds(newIds);
            setSavedOpportunities(newOpps);
            persist(newIds, newOpps);
        }
    };

    // Returns true if an opportunity is already saved
    const isSaved = (id: string) => savedIds.includes(id);

    // Clears all saved opportunities from state and localStorage
    const clearAll = () => {
        setSavedIds([]);
        setSavedOpportunities([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <SavedContext.Provider value={{ savedIds, savedOpportunities, toggleSave, isSaved, clearAll }}>
            {children}
        </SavedContext.Provider>
    );
}

// Custom hook for easy access to the SavedContext
export function useSaved() {
    const ctx = useContext(SavedContext);
    if (!ctx) throw new Error("useSaved must be used within SavedProvider");
    return ctx;
}