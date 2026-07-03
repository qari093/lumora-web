import { compatibilityJson } from "@/src/lib/runtime-guards/compatibilityResponse";
import { NextResponse } from "next/server";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

export async function POST() {
  const secret = (process.env.STRIPE_SECRET_KEY || "").trim();

  if (!secret) {
    return json(500, {
      ok: false,
      error: "missing_STRIPE_SECRET_KEY",
      route: "/api/stripe/checkout",
      canonicalRoute: "/api/zendoro/checkout",
    });
  }

  const allowLive = (process.env.STRIPE_ALLOW_LIVE_MODE || "").trim() === "true";

  if (secret.startsWith("sk_live_") && !allowLive) {
    return json(403, {
      ok: false,
      error: "stripe_live_mode_blocked",
      route: "/api/stripe/checkout",
    });
  }

  return compatibilityJson("/api/stripe/checkout", "/api/zendoro/checkout");
}
