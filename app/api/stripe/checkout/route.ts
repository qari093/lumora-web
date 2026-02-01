import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ReqBody = {
  userId: string;
  credits: number; // credits to purchase
  // optional overrides
  successUrl?: string;
  cancelUrl?: string;
};

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY || "";
    if (!secret) {
      return json(500, { ok: false, error: "missing_STRIPE_SECRET_KEY" });
    }

    const appUrl = (process.env.APP_URL || "http://127.0.0.1:3000").replace(/\/+$/, "");
    const raw = (await req.json().catch(() => null)) as ReqBody | null;

    const userId = (raw?.userId || "").trim();
    const credits = Number(raw?.credits ?? 0);

    if (!userId) return json(400, { ok: false, error: "userId_required" });
    if (!Number.isFinite(credits) || credits <= 0) return json(400, { ok: false, error: "credits_invalid" });

    const successUrl = (raw?.successUrl || `${appUrl}/wallet?stripe=success`).trim();
    const cancelUrl = (raw?.cancelUrl || `${appUrl}/wallet?stripe=cancel`).trim();

    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

    // Minimal Stripe config. Your product/pricing can be swapped later.
    // Here we treat "credits" as quantity of a single unit-price item in EUR cents.
    // NOTE: You can replace this with a real Price ID once you finalize pricing.
    const unitAmountCents = Math.max(1, Math.trunc(credits)) * 100; // 1 credit => €1.00 (placeholder)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Lumora Credits" },
            unit_amount: unitAmountCents,
          },
          quantity: 1,
        },
      ],
      metadata: { userId, credits: String(Math.trunc(credits)) },
    });

    // Persist session for webhook fulfillment (guarded: no hard dependency on schema typing)
    try {
      const tx = prisma as any;
      if (tx?.stripeCheckoutSession?.create) {
        await tx.stripeCheckoutSession.create({
          data: {
            userId,
            credits: Math.trunc(credits),
            stripeSession: session.id,
            status: "created",
          },
        });
      }
    } catch {
      // non-fatal: webhook can still use metadata, or you can enforce DB later
    }

    return json(200, { ok: true, url: session.url, sessionId: session.id });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json(500, { ok: false, error: msg, ts: Date.now() });
  }
}
