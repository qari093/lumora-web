import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = (searchParams.get("userId") || "").trim();
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || "20"), 1), 100);
    if (!userId) return bad("Missing userId", 400);

    const items = await prisma.ledgerEntry.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      ok: true,
      userId,
      count: items.length,
      items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "wallet_ledger_failed", ts: Date.now() },
      { status: 500 }
    );
  }
}
