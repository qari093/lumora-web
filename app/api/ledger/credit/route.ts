import { NextResponse } from "next/server";
import { PrismaClient, LedgerType } from "@prisma/client";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { Allow: "OPTIONS, POST" } });
}

export async function POST(req: Request) {
  try {
    const { ownerId, amountCents, refType, refId, note } = await req.json();
    if (!ownerId || typeof amountCents !== "number" || amountCents <= 0)
      return NextResponse.json({ ok: false, error: "ownerId and positive amountCents required" }, { status: 400 });

    let wallet = await prisma.wallet.findFirst({ where: { ownerId, currency: "EUR" } });
    if (!wallet) wallet = await prisma.wallet.create({ data: { ownerId, currency: "EUR", balanceCents: 0 } });

    try {
      const result = await prisma.$transaction(async (tx) => {
        const row = await tx.walletLedger.create({
          data: { walletId: wallet.id, type: "CREDIT" as LedgerType, amountCents, refType, refId, note },
        });
        const updated = await tx.wallet.update({
          where: { id: wallet.id },
          data: { balanceCents: wallet.balanceCents + amountCents },
        });
        return { row, balanceAfter: updated.balanceCents };
      });
      return NextResponse.json({
        ok: true, charged: true, walletId: wallet.id,
        ledgerId: result.row.id, amountCents, balanceAfterCents: result.balanceAfter, refType, refId,
      });
    } catch (e: any) {
      if (refType && refId) {
        const existing = await prisma.walletLedger.findFirst({ where: { walletId: wallet.id, refType, refId } });
        if (existing)
          return NextResponse.json({
            ok: true, idempotent: true, charged: false,
            walletId: wallet.id, ledgerId: existing.id, amountCents, refType, refId,
          });
      }
      throw e;
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
