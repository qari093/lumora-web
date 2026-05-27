import { NextResponse } from "next/server";
import {
  buildCanonicalOrchestratorReport,
  routeThroughCanonicalOrchestrator
} from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: buildCanonicalOrchestratorReport(),
    sample: routeThroughCanonicalOrchestrator("/api/creator-alchemy/dashboard"),
    meta: {
      domain: "infra_telemetry",
      version: "runtime-consolidation-pack-04",
      runtime: "node"
    }
  });
}
