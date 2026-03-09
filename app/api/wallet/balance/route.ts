import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = (searchParams.get("userId") || "").trim();
    if (!userId) return bad("Missing userId", 400);

    const wallet = await prisma.wallet.findUnique({
      where: { ownerId: userId },
      select: { balance: true, ownerId: true, updatedAt: true },
    });

    return NextResponse.json({
      ok: true,
      userId,
      balance: wallet?.balance ?? 0,
      updatedAt: wallet?.updatedAt ?? null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "wallet_balance_failed", ts: Date.now() },
      { status: 500 }
    );
  }
}
