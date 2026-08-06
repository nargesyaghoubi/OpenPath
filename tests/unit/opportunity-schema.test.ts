import { describe, it, expect } from "vitest";
import { opportunityInputSchema } from "@/lib/opportunity-schema";

const validPayload = {
    title: "Frontend Developer Internship",
    organization: "Acme Corp",
    category: "Internship" as const,
    country: "Germany",
    countryCode: "DE",
    location: "Frankfurt",
    type: "Remote" as const,
    deadline: "2026-12-31",
    description: "A great opportunity to learn frontend development with a supportive team.",
    requirements: ["React", "1+ years experience"],
    applyLink: "https://example.com/apply",
    tags: ["frontend", "remote"],
};

describe("opportunityInputSchema", () => {
    it("accepts a fully valid payload", () => {
        const result = opportunityInputSchema.safeParse(validPayload);
        expect(result.success).toBe(true);
    });

    it("rejects a title shorter than 5 characters", () => {
        const result = opportunityInputSchema.safeParse({ ...validPayload, title: "Dev" });
        expect(result.success).toBe(false);
    });

    it("rejects a description shorter than 30 characters", () => {
        const result = opportunityInputSchema.safeParse({ ...validPayload, description: "Too short" });
        expect(result.success).toBe(false);
    });

    it("rejects an invalid category", () => {
        const result = opportunityInputSchema.safeParse({ ...validPayload, category: "Not a category" });
        expect(result.success).toBe(false);
    });

    it("rejects a non-URL apply link", () => {
        const result = opportunityInputSchema.safeParse({ ...validPayload, applyLink: "not-a-url" });
        expect(result.success).toBe(false);
    });

    it("rejects an empty requirements list", () => {
        const result = opportunityInputSchema.safeParse({ ...validPayload, requirements: [] });
        expect(result.success).toBe(false);
    });

    it("defaults tags to an empty array when omitted", () => {
        const { tags, ...withoutTags } = validPayload;
        void tags;
        const result = opportunityInputSchema.safeParse(withoutTags);
        expect(result.success).toBe(true);
        if (result.success) expect(result.data.tags).toEqual([]);
    });
});
