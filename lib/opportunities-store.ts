// Opportunity persistence backed by PostgreSQL (via Prisma).

import { prisma } from "@/lib/prisma";
import type { Opportunity as PrismaOpportunity, OpportunityStatus } from "@prisma/client";
import type { Opportunity } from "@/types";

// Maps a Prisma row to the plain `Opportunity` shape the frontend expects.
export function toOpportunity(row: PrismaOpportunity): Opportunity {
    return {
        id: row.id,
        title: row.title,
        organization: row.organization,
        category: row.category as Opportunity["category"],
        location: row.location,
        country: row.country,
        countryCode: row.countryCode,
        type: row.type as Opportunity["type"],
        deadline: row.deadline,
        description: row.description,
        requirements: row.requirements,
        applyLink: row.applyLink,
        tags: row.tags,
        featured: row.featured,
        postedAt: row.postedAt.toISOString().split("T")[0],
        status: row.status,
        submittedBy: row.submittedBy ?? undefined,
        rejectReason: row.rejectReason ?? undefined,
    };
}

// Public feed: only opportunities an admin has approved.
export async function listApproved(): Promise<Opportunity[]> {
    const rows = await prisma.opportunity.findMany({
        where: { status: "APPROVED" },
        orderBy: { postedAt: "desc" },
    });
    return rows.map(toOpportunity);
}

// All opportunities submitted by a given user, regardless of status.
export async function listMine(userId: string): Promise<Opportunity[]> {
    const rows = await prisma.opportunity.findMany({
        where: { submittedBy: userId },
        orderBy: { createdAt: "desc" },
    });
    return rows.map(toOpportunity);
}

// Admin queue: everything, optionally filtered by status.
export async function listForAdmin(status?: OpportunityStatus): Promise<Opportunity[]> {
    const rows = await prisma.opportunity.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
    });
    return rows.map(toOpportunity);
}

export async function getByIdRaw(id: string): Promise<PrismaOpportunity | null> {
    return prisma.opportunity.findUnique({ where: { id } });
}

export async function createOpportunity(input: {
    title: string;
    organization: string;
    category: string;
    location: string;
    country: string;
    countryCode: string;
    type: string;
    deadline: string;
    description: string;
    requirements: string[];
    applyLink: string;
    tags: string[];
    featured?: boolean;
    submittedBy: string;
    autoApprove?: boolean;
}): Promise<Opportunity> {
    const { autoApprove, ...data } = input;
    const row = await prisma.opportunity.create({
        data: {
            ...data,
            featured: input.featured ?? false,
            status: autoApprove ? "APPROVED" : "PENDING",
            ...(autoApprove ? { reviewedBy: input.submittedBy, reviewedAt: new Date() } : {}),
        },
    });
    return toOpportunity(row);
}

// Update an opportunity's editable fields. Any edit by a non-admin resets
// the item back to PENDING so it goes through moderation again.
export async function updateOpportunity(
    id: string,
    updates: Partial<{
        title: string;
        organization: string;
        category: string;
        location: string;
        country: string;
        countryCode: string;
        type: string;
        deadline: string;
        description: string;
        requirements: string[];
        applyLink: string;
        tags: string[];
        featured: boolean;
    }>,
    opts: { resubmitForReview: boolean }
): Promise<Opportunity> {
    const row = await prisma.opportunity.update({
        where: { id },
        data: {
            ...updates,
            ...(opts.resubmitForReview
                ? { status: "PENDING", reviewedBy: null, reviewedAt: null, rejectReason: null }
                : {}),
        },
    });
    return toOpportunity(row);
}

export async function deleteOpportunity(id: string): Promise<void> {
    await prisma.opportunity.delete({ where: { id } });
}

export async function setStatus(
    id: string,
    status: "APPROVED" | "REJECTED",
    reviewerId: string,
    rejectReason?: string
): Promise<Opportunity> {
    const row = await prisma.opportunity.update({
        where: { id },
        data: {
            status,
            reviewedBy: reviewerId,
            reviewedAt: new Date(),
            rejectReason: status === "REJECTED" ? rejectReason ?? null : null,
        },
    });
    return toOpportunity(row);
}
