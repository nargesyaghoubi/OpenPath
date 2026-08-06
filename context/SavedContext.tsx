"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Opportunity } from "@/types";

interface SavedContextType {
    savedIds: string[];
    savedOpportunities: Opportunity[]; // live data, not a cached snapshot
    loading: boolean;
    toggleSave: (opportunity: Opportunity) => void;
    isSaved: (id: string) => boolean;
    clearAll: () => void;
}

const SavedContext = createContext<SavedContextType | null>(null);

// Only ids are persisted — content is always fetched fresh
const STORAGE_KEY = "openpath_saved_ids";

export function SavedProvider({ children }: { children: ReactNode }) {
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);

    // Restore saved ids from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Support the old snapshot format for backward compatibility
                setSavedIds(Array.isArray(parsed) ? parsed : parsed.ids || []);
            }
        } catch {
            // Ignore parse errors and start with empty state
        }
    }, []);

    // Fetch the live version of each saved id; missing/403'd items are dropped
    const refreshOpportunities = useCallback(async (ids: string[]) => {
        if (ids.length === 0) {
            setSavedOpportunities([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const results = await Promise.all(
            ids.map(async (id) => {
                try {
                    const res = await fetch(`/api/opportunities/${id}`, { cache: "no-store" });
                    if (!res.ok) return null;
                    const data = await res.json();
                    return data.opportunity as Opportunity;
                } catch {
                    return null;
                }
            })
        );
        setSavedOpportunities(results.filter((o): o is Opportunity => o !== null));
        setLoading(false);
    }, []);

    useEffect(() => {
        refreshOpportunities(savedIds);
    }, [savedIds, refreshOpportunities]);

    const persist = (ids: string[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    };

    const toggleSave = (opportunity: Opportunity) => {
        setSavedIds((prev) => {
            const next = prev.includes(opportunity.id)
                ? prev.filter((id) => id !== opportunity.id)
                : [...prev, opportunity.id];
            persist(next);
            return next;
        });
    };

    const isSaved = (id: string) => savedIds.includes(id);

    const clearAll = () => {
        setSavedIds([]);
        setSavedOpportunities([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <SavedContext.Provider value={{ savedIds, savedOpportunities, loading, toggleSave, isSaved, clearAll }}>
            {children}
        </SavedContext.Provider>
    );
}

export function useSaved() {
    const ctx = useContext(SavedContext);
    if (!ctx) throw new Error("useSaved must be used within SavedProvider");
    return ctx;
}