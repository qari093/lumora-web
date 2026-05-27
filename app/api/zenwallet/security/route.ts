import { NextResponse } from "next/server";
import { evaluateSpendRisk } from "@/src/core/zenwallet/security/security";

export async function GET() {
  return NextResponse.json({ ok: true, risk: evaluateSpendRisk({ amount: 120, newDevice: false, failedAttempts: 0 }) });
}
