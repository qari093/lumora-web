import { guardedJson } from "@/lib/api/guardedJson";
import { renderNarrativeTemplate } from "@/lib/format/templates/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const rendered = renderNarrativeTemplate("trailer", {
    title: "Super teaser drop",
    summary: "The crowd arrives before the flood.",
  });

  return guardedJson("api.format.templates", {
    ok: true,
    rendered,
    ts: Date.now(),
  });
}
