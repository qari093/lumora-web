import { NextResponse } from "next/server";
import { buildFypLiveProductionReport } from "@/src/core/launch-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: buildFypLiveProductionReport(),
    meta: {
      domain: "launch_readiness",
      phase: "06",
      category: "fyp_live_production_validation"
    }
  });
}
