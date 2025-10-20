import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { ownerId: string; refType: string; refId: string } }
) {
  try {
    const { ownerId, refType, refId } = params;

    const wallet = await prisma.wallet.findFirst({
      where: { ownerId, currency: "EUR" },
      select: { id: true },
    });
    if (!wallet) {
      return NextResponse.json({ ok: false, error: "WALLET_NOT_FOUND" }, { status: 404 });
    }

    const original = await prisma.walletLedger.findFirst({
      where: { walletId: wallet.id, refType, refId },
      orderBy: { createdAt: "asc" },
      select: { id: true, type: true, amountCents: true, createdAt: true },
    });
    if (!original) {
      return NextResponse.json({ ok: false, error: "ORIGINAL_NOT_FOUND" }, { status: 404 });
    }

    const legacyRefId = `${refType}:${refId}`;

    const refunds = await prisma.walletLedger.findMany({
      where: {
        walletId: wallet.id,
        refType: "REFUND",
        OR: [
          { refId: legacyRefId },
          { note: { startsWith: `refund:${legacyRefId}` } },
        ],
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        amountCents: true,
        refId: true,
        note: true,
        createdAt: true,
      },
    });

    const refundedSoFarCents = refunds.reduce((s, r) => s + r.amountCents, 0);
    const remainingRefundableCents = Math.max(original.amountCents - refundedSoFarCents, 0);

    return NextResponse.json({
      ok: true,
      ownerId,
      original: {
        type: original.type,
        amountCents: original.amountCents,
        refType,
        refId,
        createdAt: original.createdAt,
      },
      refunds,
      totals: {
        originalCents: original.amountCents,
        refundedSoFarCents,
        remainingRefundableCents,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
