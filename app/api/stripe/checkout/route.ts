import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const successUrl = process.env.STRIPE_SUCCESS_URL || "http://localhost:3000/shop?status=success";
const cancelUrl  = process.env.STRIPE_CANCEL_URL  || "http://localhost:3000/shop?status=cancel";

const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: "2024-06-20" })
  : null;

export async function POST(req: NextRequest) {
  let body: any;
  const contentType = req.headers.get("content-type") || "";
  try {
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { ok: false, error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON", hint: "Ensure Content-Type: application/json and raw JSON body" },
      { status: 400 }
    );
  }

  const { userId, priceId } = body || {};
  if (!userId || !priceId) {
    return NextResponse.json({ ok: false, error: "Missing userId or priceId" }, { status: 400 });
  }

  if (!stripe) {
    return NextResponse.json({ ok: false, error: "Stripe not configured yet" }, { status: 501 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId }, // helpful later in your webhook
    });

    return NextResponse.json({ ok: true, url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("Stripe create session failed:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Stripe error creating session" },
      { status: 500 }
    );
  }
}