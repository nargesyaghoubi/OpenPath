import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { listForAdmin } from "@/lib/opportunities-store";
import type { OpportunityStatus } from "@prisma/client";

// GET /api/admin/opportunities?status=PENDING — admin-only moderation queue.
export async function GET(req: NextRequest) {
    const session = await auth();
    const user = session?.user as { role?: string } | undefined;
    if (user?.role !== "admin") {
        return NextResponse.json({ error: "Admins only." }, { status: 403 });
    }

    const statusParam = req.nextUrl.searchParams.get("status");
    const validStatuses: OpportunityStatus[] = ["PENDING", "APPROVED", "REJECTED"];
    const status = validStatuses.includes(statusParam as OpportunityStatus)
        ? (statusParam as OpportunityStatus)
        : undefined;

    const opportunities = await listForAdmin(status);
    return NextResponse.json({ opportunities });
}
