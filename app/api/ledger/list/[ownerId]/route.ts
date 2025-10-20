import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: "OPTIONS, GET" },
  });
}

// Next.js 15 dynamic API routes: ctx.params is async
export async function GET(req: Request, ctx: { params: Promise<{ ownerId: string }> }) {
  try {
    const { ownerId } = await ctx.params;
    if (!ownerId) {
      return NextResponse.json({ ok: false, error: "ownerId missing" }, { status: 400 });
    }

    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const limit = Math.max(1, Math.min(100, Number(limitParam ?? 20) || 20)); // clamp 1..100

    const wallet = await prisma.wallet.findFirst({
      where: { ownerId, currency: "EUR" },
      select: {
        id: true,
        ownerId: true,
        currency: true,
        balanceCents: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!wallet) {
      return NextResponse.json({ ok: false, error: "Wallet not found" }, { status: 404 });
    }

    const ledgers = await prisma.walletLedger.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        walletId: true,
        type: true,
        amountCents: true,
        refType: true,
        refId: true,
        note: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, wallet, ledgers });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
