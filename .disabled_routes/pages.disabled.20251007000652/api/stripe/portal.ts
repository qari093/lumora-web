import type { NextApiRequest, NextApiResponse } from "next";
import { stripe, assertStripeKeys } from "@/lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    assertStripeKeys();
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { customerId } = req.body as { customerId?: string };
    if (!customerId) return res.status(400).json({ error: "Missing customerId" });

    const origin = req.headers.origin || (process.env.NEXT_PUBLIC_SITE_URL ?? "");
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: ,
    });
    res.status(200).json({ url: portal.url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "internal_error" });
  }
}
