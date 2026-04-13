import { guardedJson } from "@/lib/api/guardedJson";
import { buildAudioMotionSyncPlan } from "@/lib/video/sync/audioMotionSync";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.video.sync", {
    ok: true,
    plan: buildAudioMotionSyncPlan({
      audioStartMs: 0,
      motionStartMs: 32,
      driftToleranceMs: 48,
    }),
    ts: Date.now(),
  });
}
