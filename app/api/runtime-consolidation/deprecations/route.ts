import { NextResponse } from "next/server";
import {
  apiSuccess,
  buildRuntimeDeprecationReport
} from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    apiSuccess({
      data: buildRuntimeDeprecationReport(),
      domain: "infra_telemetry",
      version: "runtime-consolidation-pack-06",
      runtime: "node"
    })
  );
}
