import { NextResponse } from "next/server";
import {
  apiSuccess,
  assertLumoraApiResponse
} from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = apiSuccess({
    data: {
      contract: "universal_api_response",
      enforced: true
    },
    domain: "infra_telemetry",
    version: "runtime-consolidation-pack-05",
    runtime: "node"
  });

  assertLumoraApiResponse(response);

  return NextResponse.json(response);
}
