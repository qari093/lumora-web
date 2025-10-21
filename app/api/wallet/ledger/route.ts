import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { CURRENCY } from "../../../../src/lib/billing";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ownerId = url.searchParams.get("ownerId") || "";
  const currency = url.searchParams.get("currency") || CURRENCY;
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 20)));

  if (!ownerId) {
    return NextResponse.json({ ok: false, error: "Missing ownerId" }, { status: 400 });
  }

  const wallet = await prisma.wallet.findUnique({
    where: { ownerId_currency: { ownerId, currency } },
    select: { id: true, ownerId: true, currency: true, balanceCents: true },
  });

  if (!wallet) {
    return NextResponse.json({ ok: true, ownerId, currency, entries: [], balanceCents: 0 }, { status: 200 });
  }

  const entries = await prisma.ledgerEntry.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      deltaCents: true,
      reason: true,
      adId: true,
      event: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    ok: true,
    ownerId,
    currency,
    balanceCents: wallet.balanceCents,
    count: entries.length,
    entries,
  });
}

export const runtime = "nodejs";
