/* Lumora payment safety: idempotency required for checkout/webhook/order mutation flows. */
import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/src/core/payments-runtime/checkout";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.kind || !body?.userId || !body?.targetId || typeof body?.amountCents !== "number") {
    return NextResponse.json({ ok: false, error: "INVALID_CHECKOUT_REQUEST" }, { status: 400 });
  }

  try {
    return NextResponse.json({
      ok: true,
      checkout: createCheckoutSession(body),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "CHECKOUT_FAILED" }, { status: 400 });
  }
}
