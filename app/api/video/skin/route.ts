import { guardedJson } from "@/lib/api/guardedJson";
import { buildVisualSkin } from "@/lib/video/skin/visualSkin";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.video.skin", {
    ok: true,
    skin: buildVisualSkin(),
    ts: Date.now()
  });
}
