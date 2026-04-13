import { guardedJson } from "@/lib/api/guardedJson";
import { buildPerformanceThrottlePlan } from "@/lib/video/performance/throttle";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.video.performance", {
    ok: true,
    plans: {
      high: buildPerformanceThrottlePlan({ deviceMemoryGb: 8 }),
      medium: buildPerformanceThrottlePlan({ deviceMemoryGb: 3 }),
      low: buildPerformanceThrottlePlan({ lowPower: true, deviceMemoryGb: 2 }),
    },
    ts: Date.now(),
  });
}
