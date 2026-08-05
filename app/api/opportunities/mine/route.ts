import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listMine } from "@/lib/opportunities-store";

export async function GET() {
    const session = await auth();
    const user = session?.user as { id?: string } | undefined;
    if (!user?.id) {
        return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const opportunities = await listMine(user.id);
    return NextResponse.json({ opportunities });
}
