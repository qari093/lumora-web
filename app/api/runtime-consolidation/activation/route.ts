import { NextResponse } from "next/server";
import {
  apiSuccess,
  buildRuntimeActivationReport,
  evaluateRuntimeActivation
} from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    apiSuccess({
      data: {
        report: buildRuntimeActivationReport(),
        sample: evaluateRuntimeActivation({
          domain: "creator_alchemy",
          requestedLevel: 3
        })
      },
      domain: "infra_telemetry",
      version: "runtime-consolidation-pack-09",
      runtime: "node"
    })
  );
}
