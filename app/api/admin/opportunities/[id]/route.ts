import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getByIdRaw, setStatus } from "@/lib/opportunities-store";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/admin/opportunities/[id]  body: { action: "approve" | "reject", reason?: string }
export async function PATCH(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const session = await auth();
    const user = session?.user as { id?: string; role?: string } | undefined;
    if (user?.role !== "admin" || !user.id) {
        return NextResponse.json({ error: "Admins only." }, { status: 403 });
    }

    const existing = await getByIdRaw(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json().catch(() => null);
    const action = body?.action;
    if (action !== "approve" && action !== "reject") {
        return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 });
    }

    const opportunity = await setStatus(
        id,
        action === "approve" ? "APPROVED" : "REJECTED",
        user.id,
        typeof body?.reason === "string" ? body.reason : undefined
    );

    return NextResponse.json({ opportunity });
}
