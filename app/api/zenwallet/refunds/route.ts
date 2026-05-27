import { NextResponse } from "next/server";
import { evaluateRefund } from "@/src/core/zenwallet/refunds/refundChargeback";

export async function GET() {
  return NextResponse.json({ ok: true, sample: evaluateRefund(100, 30, true) });
}
