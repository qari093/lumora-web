import { NextResponse } from "next/server";

function hasWebhookSecret(): boolean {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET);
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/zendoro/webhook",
    methods: ["POST"],
    stripeWebhookConfigured: hasWebhookSecret()
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!hasWebhookSecret()) {
    return NextResponse.json(
      {
        ok: false,
        error: "stripe_webhook_not_configured",
        route: "/api/zendoro/webhook",
        requiredEnv: ["STRIPE_WEBHOOK_SECRET"],
        safe: true
      },
      { status: 503 }
    );
  }

  if (!signature) {
    return NextResponse.json(
      {
        ok: false,
        error: "missing_stripe_signature",
        route: "/api/zendoro/webhook"
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error: "webhook_signature_verification_not_wired",
      route: "/api/zendoro/webhook",
      reason: "Use Stripe constructEvent verification before enabling live fulfillment."
    },
    { status: 501 }
  );
}
