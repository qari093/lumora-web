// app/api/shop/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/** Mock coin credit — replace this later with DB update */
async function creditUserCoins(userId: string, amount: number) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000"}/api/coin/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount }),
    });
    const json = await res.json();
    console.log("💰 Coin credit result:", json);
  } catch (err) {
    console.error("❌ Coin credit failed:", err);
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 });
  }
  if (!webhookSecret) {
    return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature") || "";
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err?.message);
    return new NextResponse(`Webhook Error: ${err?.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || "unknown";
        const amount = Number(process.env.STRIPE_PRICE_COIN_AMOUNT || "100");

        console.log("✅ checkout.session.completed:", {
          userId,
          amount_total: session.amount_total,
          currency: session.currency,
        });

        // Automatically credit coins
        await creditUserCoins(userId, amount);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.warn("⚠️ payment failed:", pi.id, pi.last_payment_error?.message);
        break;
      }

      default:
        console.log("ℹ️ Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook handler error:", err?.message || err);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
