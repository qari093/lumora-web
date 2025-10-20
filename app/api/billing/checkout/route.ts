export const runtime = "nodejs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

export async function POST(req: Request) {
  try {
    const { ownerId, euros, note } = await req.json();
    if (!ownerId || euros == null) {
      return NextResponse.json({ ok: false, error: "ownerId and euros required" }, { status: 400 });
    }
    const amountCents = Math.max(0, Math.round(Number(euros) * 100));
    if (!amountCents) {
      return NextResponse.json({ ok: false, error: "amount must be > 0" }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const success_url = `${origin}/wallets/${encodeURIComponent(ownerId)}?status=success`;
    const cancel_url = `${origin}/wallets/${encodeURIComponent(ownerId)}?status=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url,
      cancel_url,
      metadata: {
        ownerId,
        note: note ?? "",
      },
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Wallet top-up" },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json(
      { ok: true, sessionId: session.id, url: session.url },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "stripe error" }, { status: 500 });
  }
}
