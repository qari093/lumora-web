import { NextResponse } from "next/server";
import { getLedger } from "@/src/core/zenwallet/ledger/ledger";

export async function GET() {
  return NextResponse.json({
    ok: true,
    ledger: getLedger(),
  });
}
