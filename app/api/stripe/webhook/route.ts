/* Lumora payment safety: idempotency required for checkout/webhook/order mutation flows. */
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { creditWalletOnce } from "@/lib/walletLedger";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  try {
    const secret = (process.env.STRIPE_SECRET_KEY || "").trim();
    if (!secret) return json(500, { ok: false, error: "missing_STRIPE_SECRET_KEY" });

    const whSecret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();

    const allowLive = (process.env.STRIPE_ALLOW_LIVE_MODE || "").trim() === "true";
    if (secret.startsWith("sk_live_") && !allowLive) {
      return json(403, { ok: false, error: "stripe_live_mode_blocked" });
    }
  
    if (!whSecret) return json(500, { ok: false, error: "missing_STRIPE_WEBHOOK_SECRET" });

    const sig = req.headers.get("stripe-signature");
    if (!sig) return json(400, { ok: false, error: "missing_stripe_signature" });

    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
    const body = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, whSecret);
    } catch (e: any) {
      const msg = typeof e?.message === "string" ? e.message : "invalid_signature";
      return json(400, { ok: false, error: "invalid_signature", detail: msg });
    }

    // Handle only what we need for credits fulfillment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Prefer metadata; fallback is not supported here (contract: metadata required)
      const userId = String((session.metadata as any)?.userId || "").trim();
      const creditsRaw = String((session.metadata as any)?.credits || "").trim();
      const credits = Number(creditsRaw);

      if (!userId) return json(400, { ok: false, error: "metadata_userId_required" });
      if (!Number.isFinite(credits) || credits <= 0) return json(400, { ok: false, error: "metadata_credits_invalid" });

      
const refId = String(session.id || "").trim();
      if (!refId) return json(500, { ok: false, error: "missing_session_id" });


      await prisma.stripeCheckoutSession.update({
        where: { stripeSession: refId },
        data: { status: "paid" },
      }).catch(() => null);
      
const applied = await creditWalletOnce({
        userId,
        amount: Math.trunc(credits),
        source: "stripe",
        refId,
      });

      if (!applied.ok) return json(500, { ok: false, error: applied.error });


      if (!applied.alreadyApplied) {
        await prisma.stripeCheckoutSession.update({
          where: { stripeSession: refId },
          data: { status: "fulfilled" },
        }).catch(() => null);
      }
      return json(200, { ok: true, applied: applied.alreadyApplied ? "already" : "credited" });
    }

    // Ignore other events (ack)
    return json(200, { ok: true, ignored: true, type: event.type });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json(500, { ok: false, error: msg, ts: Date.now() });
  }
}
