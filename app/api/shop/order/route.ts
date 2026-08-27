import {
  requireUserSession,
  userPrivateNoStoreHeaders,
} from "@/src/lib/auth/requireUserSession";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function privateJson(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return privateJson(400, {
      ok: false,
      error: "invalid_content_type",
    });
  }

  try {
    await req.json();
  } catch {
    return privateJson(400, {
      ok: false,
      error: "invalid_json",
    });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  const priceId =
    process.env.STRIPE_PRICE_ID?.trim() ||
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID?.trim() ||
    "";

  const baseUrl =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
    "http://localhost:3000";

  const successUrl =
    process.env.STRIPE_SUCCESS_URL?.trim() ||
    `${baseUrl}/shop?status=success`;

  const cancelUrl =
    process.env.STRIPE_CANCEL_URL?.trim() ||
    `${baseUrl}/shop?status=cancel`;

  if (!stripeSecret || !priceId) {
    return privateJson(503, {
      ok: false,
      error: "shop_checkout_not_configured",
    });
  }

  try {
    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2024-06-20",
    });

    const userId = auth.identity.userId;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        product: "zencoin",
        source: "lumora_zenshop",
      },
    });

    return privateJson(200, {
      ok: true,
      url: session.url,
    });
  } catch (error) {
    console.error(
      "shop_checkout_session_failed",
      error instanceof Error ? error.message : "unknown_error"
    );

    return privateJson(502, {
      ok: false,
      error: "shop_checkout_session_failed",
    });
  }
}
