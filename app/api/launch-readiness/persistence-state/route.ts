import { NextResponse } from "next/server";
import { buildPersistenceStateIntegrityReport } from "@/src/core/launch-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: buildPersistenceStateIntegrityReport(),
    meta: {
      domain: "launch_readiness",
      phase: "03",
      version: "phase-03-persistence-state-integrity"
    }
  });
}
