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

    const wallet = await prisma.wallet.findFirst({
      where: { userId },
      select: {
        id: true,
        userId: true,
        credits: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      userId,
      walletId: wallet?.id ?? null,
      balance: wallet?.credits ?? 0,
      credits: wallet?.credits ?? 0,
      updatedAt: wallet?.createdAt ?? null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "wallet_balance_failed", ts: Date.now() },
      { status: 500 }
    );
  }
}
