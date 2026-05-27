import { NextResponse } from "next/server";
import { buildZenWalletFinalSeal } from "@/src/core/zenwallet/observability/finalSeal";

export async function GET() {
  return NextResponse.json(buildZenWalletFinalSeal());
}
