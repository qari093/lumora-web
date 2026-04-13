import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ ownerId: string }> }
) {
  try {
    const { ownerId } = await ctx.params;
    const userId = (ownerId || "").trim();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || "20"), 1), 100);

    if (!userId) {
      return NextResponse.json({ ok: false, error: "Missing ownerId" }, { status: 400 });
    }

    const items = await prisma.ledgerEntry.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      ok: true,
      ownerId: userId,
      count: items.length,
      items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "ledger_list_failed", ts: Date.now() },
      { status: 500 }
    );
  }
}
