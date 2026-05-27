import { NextResponse } from "next/server";
import { cancelSubscriptionRuntime } from "@/src/core/subscriptions-runtime/cancel";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.subscriptionId) {
    return NextResponse.json({ ok: false, error: "INVALID_CANCEL_REQUEST" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    subscription: cancelSubscriptionRuntime(body),
  });
}
