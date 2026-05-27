import { NextResponse } from "next/server";
import {
  buildRouteInventoryReport,
  scanRuntimeRoutes
} from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  const routes = scanRuntimeRoutes();
  const report = buildRouteInventoryReport(routes);

  return NextResponse.json({
    ok: true,
    data: report,
    meta: {
      domain: "infra_telemetry",
      version: "runtime-consolidation-pack-01",
      runtime: "node"
    }
  });
}
