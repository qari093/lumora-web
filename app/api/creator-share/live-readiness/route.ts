import { NextResponse } from "next/server";
import {
  canApplyCreatorShareLiveReadySeal,
  creatorShareFinalLiveReadinessPhases,
} from "@/src/core/live-readiness/final-seal";

export async function GET() {
  return NextResponse.json({
    ok: true,
    phases: creatorShareFinalLiveReadinessPhases,
    liveReady: canApplyCreatorShareLiveReadySeal(),
  });
}
