import { guardedJson } from "@/lib/api/guardedJson";
import { buildCinematicTransitions } from "@/lib/motion/transitions/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.motion.transitions", {
    ok: true,
    transitions: buildCinematicTransitions(),
    ts: Date.now()
  });
}
