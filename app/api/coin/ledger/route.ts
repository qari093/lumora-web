import { requireUserSession, userPrivateNoStoreHeaders } from "@/src/lib/auth/requireUserSession";
// app/api/coin/ledger/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;
  try {
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId")?.trim();

    if (requestedUserId && requestedUserId !== auth.identity.userId) {
      return NextResponse.json(
        { ok: false, error: "forbidden_user_scope" },
        { status: 403, headers: userPrivateNoStoreHeaders() },
      );
    }

    const userId = auth.identity.userId;
    const limitParam = searchParams.get("limit") || "10";
    const limit = Math.max(1, Math.min(50, Number(limitParam) || 10));

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "missing userId" },
        { status: 400 }
      );
    }

    // Find latest transactions where this user is sender or receiver
    const txs = await prisma.coinTx.findMany({
      where: {
        OR: [
          { from: { userId } }, // relation filter (nullable)
          { to: { userId } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        amount: true,
        memo: true,
        createdAt: true,
        from: { select: { userId: true } },
        to: { select: { userId: true } },
      },
    });

    const ledger = txs.map((t) => ({
      id: t.id,
      ts: t.createdAt.getTime(),
      from: t.from?.userId ?? "system",
      to: t.to.userId,
      amount: t.amount,
      memo: t.memo ?? null,
    }));

    return NextResponse.json({ ok: true, userId, ledger }, { headers: userPrivateNoStoreHeaders() });
  } catch (err) {
    console.error("ledger error:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}