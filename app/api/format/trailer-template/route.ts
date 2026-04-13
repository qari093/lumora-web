import { guardedJson } from "@/lib/api/guardedJson";
import { buildTrailerTemplate } from "@/lib/format/trailer/templates";

export const dynamic = "force-dynamic";

export async function GET() {
  const templates = buildTrailerTemplate({
    title: "Official Trailer Drop",
    countdownLabel: "00:30 to event peak",
  });

  return guardedJson("api.format.trailer-template", {
    ok: true,
    count: templates.length,
    templates,
    ts: Date.now(),
  });
}
