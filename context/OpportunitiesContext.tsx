"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Opportunity } from "@/types";
import { opportunities as initialData } from "@/data/opportunities";

// Type definition for all available context operations
interface OpportunitiesContextType {
    opportunities: Opportunity[];
    addOpportunity: (opp: Omit<Opportunity, "id" | "createdAt">) => void;
    updateOpportunity: (id: string, opp: Partial<Opportunity>) => void;
    deleteOpportunity: (id: string) => void;
    getById: (id: string) => Opportunity | undefined;
}

const OpportunitiesContext = createContext<OpportunitiesContextType | null>(null);

// Key used to persist opportunities in localStorage
const STORAGE_KEY = "kaaryab_opportunities";

export function OpportunitiesProvider({ children }: { children: ReactNode }) {
    // Main state — initially loaded from mock data
    const [opportunities, setOpportunities] = useState<Opportunity[]>(initialData);

    // On mount, replace mock data with localStorage data if available
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setOpportunities(JSON.parse(stored));
            }
        } catch {
            // If localStorage is corrupted, fall back to mock data
            setOpportunities(initialData);
        }
    }, []);

    // Syncs both localStorage and state at the same time
    const persist = (opps: Opportunity[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(opps));
        setOpportunities(opps);
    };

    // Adds a new opportunity with auto-generated id and createdAt
    const addOpportunity = (opp: Omit<Opportunity, "id" | "createdAt">) => {
        const newOpp: Opportunity = {
            ...opp,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split("T")[0],
        };
        persist([newOpp, ...opportunities]);
    };

    // Updates a specific opportunity by id
    const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
        persist(opportunities.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    };

    // Removes a specific opportunity by id
    const deleteOpportunity = (id: string) => {
        persist(opportunities.filter((o) => o.id !== id));
    };

    // Finds and returns a single opportunity by id
    const getById = (id: string) => opportunities.find((o) => o.id === id);

    return (
        <OpportunitiesContext.Provider
            value={{ opportunities, addOpportunity, updateOpportunity, deleteOpportunity, getById }}
        >
            {children}
        </OpportunitiesContext.Provider>
    );
}

// Custom hook for easy access to the OpportunitiesContext
export function useOpportunities() {
    const ctx = useContext(OpportunitiesContext);
    if (!ctx) throw new Error("useOpportunities must be used within OpportunitiesProvider");
    return ctx;
}