import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma: any = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

async function creditFromCheckout(eventId: string, session: Stripe.Checkout.Session) {
  // Idempotency (safe even if StripeEvent table doesn’t exist)
  try {
    const existing = await prisma.stripeEvent?.findUnique?.({ where: { id: eventId } });
    if (existing) return { skipped: true, reason: "already-processed" };
  } catch {}

  const ownerId =
    (session.metadata && (session.metadata as any).ownerId) ||
    session.client_reference_id ||
    null;

  const amountCents = typeof session.amount_total === "number" ? session.amount_total : 0;

  if (!ownerId || !amountCents) {
    try {
      await prisma.stripeEvent?.create?.({
        data: { id: eventId, type: "checkout.session.completed", note: "missing ownerId/amount_total" },
      });
    } catch {}
    return { skipped: true, reason: "missing-owner-or-amount", ownerId, amountCents };
  }

  const result = await prisma.$transaction(async (tx: any) => {
    // Ensure wallet exists (EUR)
    let wallet = await tx.wallet.findFirst({ where: { ownerId: String(ownerId), currency: "EUR" } });
    if (!wallet) {
      wallet = await tx.wallet.create({
        data: { ownerId: String(ownerId), currency: "EUR", balanceCents: 0 },
      });
    }

    // Record event if table exists
    try { await tx.stripeEvent?.create?.({ data: { id: eventId, type: "checkout.session.completed" } }); } catch {}

    // Create ledger entry (connect via wallet.id)
    const ledger = await tx.walletLedger.create({
      data: {
        wallet: { connect: { id: wallet.id } },
        type: "CREDIT",
        amountCents,
        refType: "STRIPE",
        refId: session.id,
        note: "Stripe checkout",
      },
    });

    // Increment wallet balance
    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balanceCents: { increment: amountCents } },
    });

    return { credited: true, ownerId, walletId: wallet.id, amountCents, ledgerId: ledger.id };
  });

  return result;
}

export async function POST(req: NextRequest) {
  const whsec = process.env.STRIPE_WEBHOOK_SECRET || "";
  const sig = req.headers.get("stripe-signature") || "";
  const raw = await req.text();

  if (!whsec) return new NextResponse("Server misconfigured (no STRIPE_WEBHOOK_SECRET)", { status: 500 });
  if (!sig)   return new NextResponse("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whsec);
  } catch (err: any) {
    console.error("WEBHOOK_SIG_VERIFY_FAILED", err?.message || err);
    return new NextResponse("Signature verify failed", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const res = await creditFromCheckout(event.id, s);
        console.log("CREDIT_RESULT", res);
        break;
      }
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log("PI_OK", { id: pi.id, amount: pi.amount });
        break;
      }
      default:
        console.log("UNHANDLED_EVENT", event.type);
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("WEBHOOK_HANDLER_ERROR", err?.message || err);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
