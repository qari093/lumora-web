import { NextResponse } from "next/server";
import { buildRealtimeEventIntegrityReport } from "@/src/core/launch-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: buildRealtimeEventIntegrityReport(),
    meta: {
      domain: "launch_readiness",
      phase: "05",
      category: "realtime_event_integrity"
    }
  });
}
