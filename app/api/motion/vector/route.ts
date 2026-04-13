import { guardedJson } from "@/lib/api/guardedJson";
import { buildVectorOverlay } from "@/lib/motion/vector/overlay";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.motion.vector", {
    ok: true,
    layers: buildVectorOverlay(),
    ts: Date.now()
  });
}
