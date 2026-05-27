import { NextResponse } from "next/server";
import { handlePaymentWebhook, type PaymentWebhookEvent } from "@/src/core/payments-runtime/webhook";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.type) {
    return NextResponse.json({ ok: false, error: "INVALID_WEBHOOK" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    result: handlePaymentWebhook(body.type as PaymentWebhookEvent),
  });
}
