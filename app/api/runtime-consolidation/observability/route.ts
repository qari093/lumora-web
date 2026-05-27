import { NextResponse } from "next/server";
import {
  apiSuccess,
  buildRuntimeObservabilityReport
} from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    apiSuccess({
      data: buildRuntimeObservabilityReport(),
      domain: "infra_telemetry",
      version: "runtime-consolidation-pack-10",
      runtime: "node"
    })
  );
}
