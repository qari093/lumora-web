import { NextResponse } from "next/server";

type CheckoutBody = {
  productId?: string;
  quantity?: number;
  mode?: "test" | "live";
};

function hasStripeSecret(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/zendoro/checkout",
    methods: ["POST"],
    stripeConfigured: hasStripeSecret()
  });
}

export async function POST(request: Request) {
  let body: CheckoutBody = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  if (!hasStripeSecret()) {
    return NextResponse.json(
      {
        ok: false,
        error: "stripe_not_configured",
        route: "/api/zendoro/checkout",
        requiredEnv: ["STRIPE_SECRET_KEY"],
        safe: true
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error: "checkout_session_not_enabled",
      route: "/api/zendoro/checkout",
      productId: body.productId ?? null,
      quantity: typeof body.quantity === "number" ? body.quantity : 1,
      reason: "Stripe checkout creation must be wired to persistent Zendoro orders before live activation."
    },
    { status: 501 }
  );
}
