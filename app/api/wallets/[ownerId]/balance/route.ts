import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { ownerId: string } }
) {
  try {
    const ownerId = params.ownerId;
    if (!ownerId) {
      return NextResponse.json({ ok: false, error: "MISSING_OWNER_ID" }, { status: 400 });
    }

    const wallet = await prisma.wallet.findFirst({
      where: { ownerId, currency: "EUR" },
      select: { id: true, ownerId: true, currency: true, balanceCents: true, updatedAt: true },
    });

    if (!wallet) {
      return NextResponse.json({ ok: false, error: "WALLET_NOT_FOUND" }, { status: 404 });
    }

    const euros = wallet.balanceCents / 100;
    return NextResponse.json({
      ok: true,
      walletId: wallet.id,
      ownerId: wallet.ownerId,
      currency: wallet.currency,
      balanceCents: wallet.balanceCents,
      balanceEuros: Number(euros.toFixed(2)),
      updatedAt: wallet.updatedAt,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
