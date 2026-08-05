import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getByIdRaw, toOpportunity, updateOpportunity, deleteOpportunity } from "@/lib/opportunities-store";
import { opportunityInputSchema } from "@/lib/opportunity-schema";

type Params = { params: Promise<{ id: string }> };

// GET — public if APPROVED, otherwise owner/admin only
export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const row = await getByIdRaw(id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (row.status !== "APPROVED") {
        const session = await auth();
        const user = session?.user as { id?: string; role?: string } | undefined;
        const isOwner = user?.id && user.id === row.submittedBy;
        const isAdmin = user?.role === "admin";
        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
    }

    return NextResponse.json({ opportunity: toOpportunity(row) });
}

// PUT — owner or admin only; non-admin edits go back to PENDING for re-review
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const session = await auth();
    const user = session?.user as { id?: string; role?: string } | undefined;
    if (!user?.id) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

    const existing = await getByIdRaw(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isAdmin = user.role === "admin";
    const isOwner = user.id === existing.submittedBy;
    if (!isAdmin && !isOwner) {
        return NextResponse.json({ error: "You don't have permission to edit this opportunity." }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const parsed = opportunityInputSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid data." },
            { status: 400 }
        );
    }

    const opportunity = await updateOpportunity(id, parsed.data, { resubmitForReview: !isAdmin });
    return NextResponse.json({ opportunity });
}

// DELETE — owner or admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const session = await auth();
    const user = session?.user as { id?: string; role?: string } | undefined;
    if (!user?.id) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

    const existing = await getByIdRaw(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isAdmin = user.role === "admin";
    const isOwner = user.id === existing.submittedBy;
    if (!isAdmin && !isOwner) {
        return NextResponse.json({ error: "You don't have permission to delete this opportunity." }, { status: 403 });
    }

    await deleteOpportunity(id);
    return NextResponse.json({ success: true });
}