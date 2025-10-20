import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DebitType = "DEBIT" | "AD_SPEND" | "RESERVE" | "TRANSFER_OUT";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const ownerId = String(body.ownerId || "").trim();
    const amountCents = Number(body.amountCents ?? NaN);
    const debitType = String(body.type || "DEBIT").trim() as DebitType;
    const refType = body.refType ? String(body.refType).trim() : null;
    const refId = body.refId ? String(body.refId).trim() : null;
    const note = body.note ? String(body.note) : null;

    if (!ownerId) {
      return NextResponse.json({ ok: false, error: "ownerId is required" }, { status: 400 });
    }
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return NextResponse.json({ ok: false, error: "amountCents must be > 0" }, { status: 400 });
    }

    const wallet = await prisma.wallet.findFirst({ where: { ownerId, currency: "EUR" } });
    if (!wallet) {
      return NextResponse.json({ ok: false, error: "Wallet not found" }, { status: 404 });
    }

    if (refType && refId) {
      const existing = await prisma.walletLedger.findFirst({
        where: { walletId: wallet.id, refType, refId },
        orderBy: { createdAt: "asc" },
      });
      if (existing) {
        return NextResponse.json({
          ok: true,
          idempotent: true,
          charged: false,
          walletId: wallet.id,
          ledgerId: existing.id,
          amountCents,
          type: existing.type,
          refType,
          refId,
        });
      }
    }

    const nextBalance = wallet.balanceCents - amountCents;
    if (nextBalance < 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "INSUFFICIENT_FUNDS",
          message: "Debit would overdraw the wallet.",
          currentBalanceCents: wallet.balanceCents,
          debitAmountCents: amountCents,
          type: debitType,
          ...(refType && refId ? { refType, refId } : {}),
        },
        { status: 402 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const row = await tx.walletLedger.create({
        data: { walletId: wallet.id, type: debitType, amountCents, refType, refId, note },
      });
      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balanceCents: nextBalance },
      });
      return { row, balanceAfter: updated.balanceCents };
    });

    return NextResponse.json({
      ok: true,
      charged: true,
      walletId: wallet.id,
      ledgerId: result.row.id,
      amountCents,
      type: debitType,
      balanceAfterCents: result.balanceAfter,
      refType,
      refId,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
