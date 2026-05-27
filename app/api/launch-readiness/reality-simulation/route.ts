import { NextResponse } from "next/server";
import { buildRealitySimulationReport } from "@/src/core/launch-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: buildRealitySimulationReport(),
    meta: {
      domain: "launch_readiness",
      phase: "02",
      version: "phase-02-reality-simulation"
    }
  });
}
