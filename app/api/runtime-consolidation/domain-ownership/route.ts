import { NextResponse } from "next/server";
import { buildDomainOwnershipReport } from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: buildDomainOwnershipReport(),
    meta: {
      domain: "infra_telemetry",
      version: "runtime-consolidation-pack-02",
      runtime: "node"
    }
  });
}
