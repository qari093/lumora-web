import { NextResponse } from "next/server";
import {
  apiSuccess,
  buildRuntimeConsolidationSealReport
} from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    apiSuccess({
      data: buildRuntimeConsolidationSealReport(),
      domain: "infra_telemetry",
      version: "runtime-consolidation-pack-12",
      runtime: "node"
    })
  );
}
