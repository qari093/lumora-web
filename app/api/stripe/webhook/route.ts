import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type StripeLikeEvent = { id: string; type: string; data?: { object?: any } };

function parseEvent(bodyText: string): StripeLikeEvent {
  try { return JSON.parse(bodyText); } catch { throw new Error("Invalid JSON payload"); }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, stripe-signature",
    },
  });
}

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    const evt = parseEvent(raw);
    const eventId = evt.id;
    const eventType = evt.type || "unknown";
    const obj = evt.data?.object ?? {};
    const md = obj.metadata ?? {};
    const ownerId = md.ownerId || md.userId || md.accountId || undefined;
    const amountCents = Number(
      md.amountCents ?? md.amount_cents ?? obj.amount_total ?? obj.amount ?? 0
    );
    if (!eventId)
      return NextResponse.json({ ok: false, error: "event id missing" }, { status: 400 });

    const already = await prisma.walletLedger.findFirst({
      where: { refType: "STRIPE", refId: eventId },
      select: { id: true, walletId: true },
    });
    if (already)
      return NextResponse.json({
        ok: true,
        idempotent: true,
        credited: false,
        eventId,
        eventType,
        ledgerId: already.id,
        walletId: already.walletId,
      });

    const shouldCredit =
      ["checkout.session.completed", "payment_intent.succeeded"].includes(eventType) &&
      ownerId &&
      amountCents > 0;

    try {
      await prisma.stripeEvent.create({
        data: { type: eventType, eventId, payloadJson: raw } as any,
      });
    } catch {}

    if (!shouldCredit)
      return NextResponse.json({
        ok: true,
        credited: false,
        eventId,
        eventType,
        reason:
          !ownerId
            ? "ownerId missing in metadata"
            : amountCents <= 0
            ? "amountCents not provided/<=0"
            : "event type not credit-eligible",
      });

    const wallet =
      (await prisma.wallet.findFirst({ where: { ownerId, currency: "EUR" } })) ||
      (await prisma.wallet.create({
        data: { ownerId, currency: "EUR", balanceCents: 0 },
      }));

    try {
      const result = await prisma.$transaction(async (tx) => {
        const nextBalance = wallet.balanceCents + amountCents;
        const row = await tx.walletLedger.create({
          data: {
            walletId: wallet.id,
            type: "CREDIT",
            amountCents,
            refType: "STRIPE",
            refId: eventId,
            note: "Stripe webhook",
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
        credited: true,
        walletId: wallet.id,
        ledgerId: result.row.id,
        amountCents,
        balanceAfterCents: result.balanceAfter,
        refType: "STRIPE",
        refId: eventId,
        eventType,
      });
    } catch (e: any) {
      const existing = await prisma.walletLedger.findFirst({
        where: { walletId: wallet.id, refType: "STRIPE", refId: eventId },
        select: { id: true },
      });
      if (existing)
        return NextResponse.json({
          ok: true,
          idempotent: true,
          credited: false,
          walletId: wallet.id,
          ledgerId: existing.id,
          amountCents,
          refType: "STRIPE",
          refId: eventId,
          eventType,
        });
      throw e;
    }
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
