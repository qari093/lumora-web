import { guardedJson } from "@/lib/api/guardedJson";
import { buildMotionGradient } from "@/lib/motion/gradient/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.motion.gradient", {
    ok: true,
    gradient: buildMotionGradient(),
    ts: Date.now()
  });
}
