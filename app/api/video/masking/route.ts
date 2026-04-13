import { guardedJson } from "@/lib/api/guardedJson";
import { buildTrailerMaskConfig } from "@/lib/video/masking/trailerMask";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.video.masking", {
    ok: true,
    config: buildTrailerMaskConfig(),
    ts: Date.now(),
  });
}
