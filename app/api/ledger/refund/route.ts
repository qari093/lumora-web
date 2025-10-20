import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RefundBody = {
  ownerId: string;
  amountCents: number;
  originalRefType: string;   // e.g. "TEST" or "CPV"
  originalRefId: string;     // e.g. "small-debit-1"
  refundKey: string;         // client-supplied idempotency key
  note?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RefundBody;
    const { ownerId, amountCents, originalRefType, originalRefId, refundKey, note } = body;

    if (!ownerId || !amountCents || amountCents <= 0 || !originalRefType || !originalRefId || !refundKey) {
      return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
    }

    // Locate wallet
    const wallet = await prisma.wallet.findFirst({
      where: { ownerId, currency: "EUR" },
    });
    if (!wallet) {
      return NextResponse.json({ ok: false, error: "WALLET_NOT_FOUND" }, { status: 404 });
    }

    // 1) TRUE idempotency by refundKey
    const existingByKey = await prisma.walletLedger.findFirst({
      where: { walletId: wallet.id, refType: "REFUND", refId: refundKey },
      select: { id: true, amountCents: true, createdAt: true },
    });
    if (existingByKey) {
      return NextResponse.json({
        ok: true,
        idempotent: true,
        refunded: false,
        walletId: wallet.id,
        ledgerId: existingByKey.id,
        amountCents: existingByKey.amountCents,
        refundRefType: "REFUND",
        refundRefId: refundKey,
        note: "duplicate refund key",
      });
    }

    // 1b) Backward-compat: treat the legacy pattern (refId = "<origType>:<origId>") as idempotent too.
    const legacyRefId = `${originalRefType}:${originalRefId}`;
    const existingLegacy = await prisma.walletLedger.findFirst({
      where: { walletId: wallet.id, refType: "REFUND", refId: legacyRefId, amountCents },
      select: { id: true, amountCents: true, createdAt: true },
    });
    if (existingLegacy) {
      return NextResponse.json({
        ok: true,
        idempotent: true,
        refunded: false,
        walletId: wallet.id,
        ledgerId: existingLegacy.id,
        amountCents: existingLegacy.amountCents,
        refundRefType: "REFUND",
        refundRefId: legacyRefId,
        note: "duplicate refund against legacy refId",
      });
    }

    // 2) Find the original debit/spend amount
    const original = await prisma.walletLedger.findFirst({
      where: { walletId: wallet.id, refType: originalRefType, refId: originalRefId },
      orderBy: { createdAt: "asc" },
      select: { id: true, type: true, amountCents: true },
    });
    if (!original) {
      return NextResponse.json({ ok: false, error: "ORIGINAL_NOT_FOUND" }, { status: 404 });
    }

    // 3) Sum previously refunded amounts for this original.
    // Support both: new scheme (note = "refund:<type>:<id>") and legacy (refId = "<type>:<id>")
    const refundedRows = await prisma.walletLedger.findMany({
      where: {
        walletId: wallet.id,
        refType: "REFUND",
        OR: [
          { refId: legacyRefId },
          { note: { startsWith: `refund:${legacyRefId}` } },
        ],
      },
      select: { amountCents: true },
    });
    const refundedSoFar = refundedRows.reduce((s, r) => s + r.amountCents, 0);

    const originalDebit = original.amountCents; // for AD_SPEND/DEBIT the row stores positive cents
    const remaining = originalDebit - refundedSoFar;

    if (amountCents > remaining) {
      return NextResponse.json(
        {
          ok: false,
          error: "REFUND_EXCEEDS_ORIGINAL",
          originalAmountCents: originalDebit,
          refundedSoFarCents: refundedSoFar,
          requestedRefundCents: amountCents,
          remainingRefundableCents: Math.max(remaining, 0),
        },
        { status: 409 }
      );
    }

    // 4) Create the refund as a RELEASE (credit back), using refundKey for idempotency.
    const result = await prisma.$transaction(async (tx) => {
      const nextBalance = wallet.balanceCents + amountCents;

      const row = await tx.walletLedger.create({
        data: {
          walletId: wallet.id,
          type: "RELEASE",                 // refund is a credit back
          amountCents,
          refType: "REFUND",
          refId: refundKey,                // <— idempotency lives here
          note: `refund:${legacyRefId}${note ? ` — ${note}` : ""}`,
        },
      });

      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balanceCents: nextBalance },
      });

      return { row, balanceAfter: updated.balanceCents };
    });

    return NextResponse.json({
      ok: true,
      refunded: true,
      walletId: wallet.id,
      ledgerId: result.row.id,
      amountCents,
      balanceAfterCents: result.balanceAfter,
      originalRefType,
      originalRefId,
      refundRefType: "REFUND",
      refundRefId: refundKey,
    });
  } catch (e: any) {
    // unique(refType, refId) catch → treat as idempotent if it matches refundKey
    try {
      const body = (await req.json()) as RefundBody;
      const wallet = await prisma.wallet.findFirst({ where: { ownerId: body.ownerId, currency: "EUR" } });
      if (wallet) {
        const existing = await prisma.walletLedger.findFirst({
          where: { walletId: wallet.id, refType: "REFUND", refId: body.refundKey },
          select: { id: true, amountCents: true },
        });
        if (existing) {
          return NextResponse.json({
            ok: true,
            idempotent: true,
            refunded: false,
            walletId: wallet.id,
            ledgerId: existing.id,
            amountCents: existing.amountCents,
            refundRefType: "REFUND",
            refundRefId: body.refundKey,
            note: "duplicate refund key",
          });
        }
      }
    } catch {}
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
