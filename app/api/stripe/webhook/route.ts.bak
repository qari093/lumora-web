import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whSecret) {
    console.error("[stripe:webhook] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ ok: false, error: "server misconfigured" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature") || "";
  const raw = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err: any) {
    console.error("[stripe:webhook] signature verification failed:", err?.message || err);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId  = (session.metadata?.userId ?? "demo-user-123");
      const credits = Number(session.metadata?.credits ?? 0);
      const amount  = Number(session.amount_total ?? 0); // in cents
      const currency = (session.currency ?? "usd").toLowerCase();
      const sessionId = session.id;
      const paymentIntent = typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

      // idempotent write: transaction sessionId is unique
      await prisma.$transaction(async (tx) => {
        // ensure account exists
        await tx.account.upsert({
          where: { id: userId },
          update: {},
          create: { id: userId },
        });

        // create transaction (will throw if session already processed)
        await tx.creditTransaction.create({
          data: {
            accountId: userId,
            stripeSessionId: sessionId,
            stripePaymentIntent: paymentIntent ?? null,
            amount,
            currency,
            credits,
          },
        });

        // increment balance
        await tx.account.update({
          where: { id: userId },
          data: { balance: { increment: credits } },
        });
      });

      console.log(`[stripe:webhook] credited ${credits} to ${userId} (session ${sessionId})`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("[stripe:webhook] handler error:", err?.message || err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

// Stripe needs the raw body, so disable Nexts body parsing for this route
export const config = { api: { bodyParser: false } } as any;
