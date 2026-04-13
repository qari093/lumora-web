import { guardedJson } from "@/lib/api/guardedJson";
import { buildContextOverlay } from "@/lib/format/overlay/renderer";

export const dynamic = "force-dynamic";

export async function GET() {
  const overlays = buildContextOverlay({
    category: "trailer_event",
    region: "global",
    language: "en",
  });

  return guardedJson("api.format.overlay", {
    ok: true,
    count: overlays.length,
    overlays,
    ts: Date.now(),
  });
}
