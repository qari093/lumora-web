import { guardedJson } from "@/lib/api/guardedJson";
import { getFallbackVisuals } from "@/lib/video/fallback/visuals";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.video.fallback", {
    ok: true,
    visuals: getFallbackVisuals(),
    ts: Date.now(),
  });
}
