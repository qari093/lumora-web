import { NextResponse } from "next/server";
import { buildFinalLaunchSealReport } from "@/src/core/launch-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: buildFinalLaunchSealReport(),
    meta: {
      domain: "launch_readiness",
      phase: "08",
      category: "infrastructure_final_launch_seal"
    }
  });
}
