import { guardedJson } from "@/lib/api/guardedJson";
import { smoothMotionSeries } from "@/lib/motion/smoothing/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const input = [0.1, 0.8, 0.3, 0.95, 0.4];
  return guardedJson("api.motion.smoothing", {
    ok: true,
    input,
    output: smoothMotionSeries(input),
    ts: Date.now()
  });
}
