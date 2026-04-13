import { guardedJson } from "@/lib/api/guardedJson";
import { mapAudioEnergyToMotion } from "@/lib/motion/audio-reactive/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.motion.audio-reactive", {
    ok: true,
    sample: mapAudioEnergyToMotion(0.72),
    ts: Date.now()
  });
}
