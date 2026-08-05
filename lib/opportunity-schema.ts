import { z } from "zod/v4";
// Server-side validation 
export const opportunityInputSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    organization: z.string().min(2, "Organization required"),
    category: z.enum([
        "Job",
        "Internship",
        "Scholarship",
        "Online Course",
        "Remote Work",
        "Training Program",
        "Volunteer",
    ]),
    country: z.string().min(2, "Country required"),
    countryCode: z.string().min(1).default("GL"),
    location: z.string().min(2, "Location required"),
    type: z.enum(["Remote", "On-site", "Hybrid"]),
    deadline: z.string().min(1, "Deadline required"),
    description: z.string().min(30, "Description must be at least 30 characters"),
    requirements: z.array(z.string()).min(1, "At least one requirement"),
    applyLink: z.string().url("Must be a valid URL"),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().optional(),
});

export type OpportunityInput = z.infer<typeof opportunityInputSchema>;
