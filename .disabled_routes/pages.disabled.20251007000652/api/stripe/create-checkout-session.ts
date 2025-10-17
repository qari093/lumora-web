import type { NextApiRequest, NextApiResponse } from "next";
import { stripe, assertStripeKeys } from "@/src/lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    assertStripeKeys();
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { priceId, email } = req.body as { priceId?: string; email?: string };
    const price = priceId || process.env.STRIPE_PRICE_MONTHLY;

    if (!price) return res.status(400).json({ error: "Missing priceId" });

    const origin = req.headers.origin || (process.env.NEXT_PUBLIC_SITE_URL ?? "");
    const success_url = ;
    const cancel_url = ;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url,
      cancel_url,
      allow_promotion_codes: true,
      metadata: { product: "Lumora Live", plan: price },
      customer_email: email,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "internal_error" });
  }
}
