"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Opportunity } from "@/types";

// Fields accepted when creating/updating an opportunity via the API
export type OpportunityPayload = Omit<Opportunity, "id" | "postedAt" | "status" | "submittedBy">;

interface OpportunitiesContextType {
    opportunities: Opportunity[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    addOpportunity: (opp: OpportunityPayload) => Promise<Opportunity>;
    updateOpportunity: (id: string, opp: OpportunityPayload) => Promise<Opportunity>;
    deleteOpportunity: (id: string) => Promise<void>;
    getById: (id: string) => Opportunity | undefined;
}

const OpportunitiesContext = createContext<OpportunitiesContextType | null>(null);

async function parseError(res: Response, fallback: string): Promise<string> {
    try {
        const body = await res.json();
        return body?.error ?? fallback;
    } catch {
        return fallback;
    }
}

export function OpportunitiesProvider({ children }: { children: ReactNode }) {
    // Public feed of approved opportunities
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/opportunities", { cache: "no-store" });
            if (!res.ok) throw new Error(await parseError(res, "Failed to load opportunities."));
            const data = await res.json();
            setOpportunities(data.opportunities ?? []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load opportunities.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addOpportunity = async (opp: OpportunityPayload): Promise<Opportunity> => {
        const res = await fetch("/api/opportunities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(opp),
        });
        if (!res.ok) throw new Error(await parseError(res, "Failed to submit opportunity."));
        const data = await res.json();
        // New submissions are PENDING, so no need to merge into public state
        return data.opportunity as Opportunity;
    };

    const updateOpportunity = async (id: string, updates: OpportunityPayload): Promise<Opportunity> => {
        const res = await fetch(`/api/opportunities/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error(await parseError(res, "Failed to update opportunity."));
        const data = await res.json();
        await refresh();
        return data.opportunity as Opportunity;
    };

    const deleteOpportunity = async (id: string): Promise<void> => {
        const res = await fetch(`/api/opportunities/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(await parseError(res, "Failed to delete opportunity."));
        setOpportunities((prev) => prev.filter((o) => o.id !== id));
    };

    // Only searches the loaded (approved) list — pending/rejected items
    const getById = (id: string) => opportunities.find((o) => o.id === id);

    return (
        <OpportunitiesContext.Provider
            value={{ opportunities, loading, error, refresh, addOpportunity, updateOpportunity, deleteOpportunity, getById }}
        >
            {children}
        </OpportunitiesContext.Provider>
    );
}

export function useOpportunities() {
    const ctx = useContext(OpportunitiesContext);
    if (!ctx) throw new Error("useOpportunities must be used within OpportunitiesProvider");
    return ctx;
}