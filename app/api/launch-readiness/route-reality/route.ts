import { NextResponse } from "next/server";
import {
  buildLaunchRouteRealityReport,
  scanLaunchRoutes,
  summarizeRuntimeProbePlan
} from "@/src/core/launch-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const routes = scanLaunchRoutes();

  return NextResponse.json({
    ok: true,
    data: {
      report: buildLaunchRouteRealityReport(routes),
      runtimeProbePlan: summarizeRuntimeProbePlan(routes)
    },
    meta: {
      domain: "launch_readiness",
      phase: "01",
      version: "phase-01-route-reality"
    }
  });
}
