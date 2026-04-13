import { guardedJson } from "@/lib/api/guardedJson";
import { buildDeepColorConfig } from "@/lib/video/color/upscaler";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.video.color", {
    ok: true,
    config: buildDeepColorConfig(),
    ts: Date.now()
  });
}
