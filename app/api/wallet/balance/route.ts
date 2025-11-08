// app/api/wallet/balance/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getWallet, /* optional */ getLedgerCount as _getLedgerCount } from "@/lib/wallet";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ownerId = url.searchParams.get("ownerId") || undefined;
    if (!ownerId) {
      return NextResponse.json({ ok: false, error: "ownerId is required" }, { status: 400 });
    }

    // --- 1) Try Prisma-backed wallet first (so Stripe webhook credits are visible)
    try {
      const dbWallet = await prisma.wallet.findFirst({
        where: { ownerId, currency: "EUR" },
        select: { id: true, balanceCents: true },
      });

      if (dbWallet) {
        const euros = Number((dbWallet.balanceCents / 100).toFixed(2));
        const ledgerCount = await prisma.walletLedger.count({ where: { walletId: dbWallet.id } });
        return NextResponse.json({
          ok: true,
          ownerId,
          euros,
          ledgerCount,
          source: "prisma",
          requestId: Math.random().toString(36).slice(2),
        });
      }
    } catch {
      // If Prisma errors (e.g., no DB in local mode), we’ll fall back to memory.
    }

    // --- 2) Fallback to in-memory wallet/ledger
    const wallet = await getWallet(ownerId);
    const getLedgerCount =
      typeof _getLedgerCount === "function" ? _getLedgerCount : undefined;

    return NextResponse.json({
      ok: true,
      ownerId: wallet.ownerId,
      euros: wallet.euros,
      ...(getLedgerCount ? { ledgerCount: getLedgerCount(ownerId) } : {}),
      source: "memory",
      requestId: Math.random().toString(36).slice(2),
    });
  } catch (err) {
    console.error("[wallet/balance] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}