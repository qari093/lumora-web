import { guardedJson } from "@/lib/api/guardedJson";
import { buildGrainLayer } from "@/lib/motion/grain/layer";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.motion.grain", {
    ok: true,
    layer: buildGrainLayer(),
    ts: Date.now()
  });
}
