import { guardedJson } from "@/lib/api/guardedJson";
import { getMotionPreviewProvider } from "@/lib/video/preview/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.video.preview", {
    ok: true,
    preview: getMotionPreviewProvider(),
    ts: Date.now()
  });
}
