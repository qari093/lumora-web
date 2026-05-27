import { NextResponse } from "next/server";
import { createSubscriptionRuntime } from "@/src/core/subscriptions-runtime/create";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.userId || !body?.tierId) {
    return NextResponse.json({ ok: false, error: "INVALID_SUBSCRIPTION_REQUEST" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    subscription: createSubscriptionRuntime(body),
  });
}
