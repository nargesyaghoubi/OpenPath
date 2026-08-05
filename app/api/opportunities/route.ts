import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { listApproved, createOpportunity } from "@/lib/opportunities-store";
import { opportunityInputSchema } from "@/lib/opportunity-schema";

// GET /api/opportunities — public feed of admin-approved opportunities only.
export async function GET() {
    const opportunities = await listApproved();
    return NextResponse.json({ opportunities });
}

// authenticated users submit a new opportunity.
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = opportunityInputSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid data." },
            { status: 400 }
        );
    }

    const userId = (session.user as { id: string }).id;
    const isAdmin = (session.user as { role?: string }).role === "admin";
    const opportunity = await createOpportunity({ ...parsed.data, submittedBy: userId, autoApprove: isAdmin });

    return NextResponse.json({ opportunity }, { status: 201 });
}
