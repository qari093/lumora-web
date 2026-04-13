import { guardedJson } from "@/lib/api/guardedJson";
import { resolveMotionPerformanceMode } from "@/lib/motion/performance/fallback";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.motion.performance", {
    ok: true,
    full: resolveMotionPerformanceMode({ deviceMemoryGb: 8 }),
    balanced: resolveMotionPerformanceMode({ deviceMemoryGb: 2 }),
    safe: resolveMotionPerformanceMode({ deviceMemoryGb: 8, reducedMotion: true }),
    ts: Date.now()
  });
}
