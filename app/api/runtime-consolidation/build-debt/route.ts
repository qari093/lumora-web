import { NextResponse } from "next/server";
import {
  apiSuccess,
  buildCurrentBuildDebtBaseline
} from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    apiSuccess({
      data: buildCurrentBuildDebtBaseline(),
      domain: "infra_telemetry",
      version: "runtime-consolidation-pack-11",
      runtime: "node"
    })
  );
}
