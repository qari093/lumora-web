import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId  = String(body.userId || "demo-user-123");
    const credits = Number(body.credits || 100);

    // simple pricing: $1 per 100 credits (adjust as you wish)
    const unitUSD = credits / 100;         // $1 for 100 credits
    const amount  = Math.max(1, Math.round(unitUSD * 100)); // cents, min 1¢

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/buy-credits?state=success`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/buy-credits?state=cancel`,
      payment_method_types: ["card"],
      metadata: { userId, credits: String(credits) }, // ← used by webhook
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: { name: `Lumora Credits ×${credits}` },
            unit_amount: amount,
          },
        },
      ],
    });

    return NextResponse.json({ ok: true, id: session.id, url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("[stripe:create-checkout]", err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
