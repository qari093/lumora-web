import { NextResponse } from "next/server";
import { PLANS } from "@/src/core/zenwallet/subscriptions/subscriptionEconomy";

export async function GET() {
  return NextResponse.json({ ok: true, plans: PLANS });
}
