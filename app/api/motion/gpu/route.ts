import { guardedJson } from "@/lib/api/guardedJson";
import { buildGpuOptimizationPlan } from "@/lib/motion/gpu/optimizer";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.motion.gpu", {
    ok: true,
    plan: buildGpuOptimizationPlan(),
    ts: Date.now()
  });
}
