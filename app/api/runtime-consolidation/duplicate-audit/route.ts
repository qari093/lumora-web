import { NextResponse } from "next/server";
import {
  auditDuplicateResponsibilities,
  summarizeDuplicateAudit
} from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: auditDuplicateResponsibilities(),
    summary: summarizeDuplicateAudit(),
    meta: {
      domain: "infra_telemetry",
      version: "runtime-consolidation-pack-03",
      runtime: "node"
    }
  });
}
