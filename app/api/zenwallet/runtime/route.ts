import { NextResponse } from "next/server";
import { getZenWalletRuntimeTelemetry } from "@/src/core/zenwallet/telemetry/runtimeTelemetry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    telemetry: getZenWalletRuntimeTelemetry(),
  });
}
