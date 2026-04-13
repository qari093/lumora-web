import { guardedJson } from "@/lib/api/guardedJson";
import { validate60Fps } from "@/lib/motion/fps/stability";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = validate60Fps([
    { frameTimeMs: 16.1 },
    { frameTimeMs: 16.7 },
    { frameTimeMs: 17.0 },
    { frameTimeMs: 15.9 },
    { frameTimeMs: 16.4 }
  ]);

  return guardedJson("api.motion.fps", {
    ok: true,
    result,
    ts: Date.now()
  });
}
