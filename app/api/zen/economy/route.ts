import { NextResponse } from "next/server";
import { createZenLedgerEntry } from "@/lib/zen/zenEconomy";

export async function GET() {
  return NextResponse.json({
    ok: true,
    entry: createZenLedgerEntry({
      action: "gift",
      amount: 1,
      reason: "creator_resonance"
    })
  });
}
