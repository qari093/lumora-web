import { guardedJson } from "@/lib/api/guardedJson";
import { buildBaseContent } from "@/lib/content/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample = buildBaseContent({
    id: "content_sample_001",
    title: "Sample Lumora Content",
    summary: "Unified schema baseline",
    type: "signal_card",
    sourceSignalId: "signal_sample_001",
    sourcePlatform: "internal",
    language: "en",
    region: "global",
    metadata: { phase: "content_graph" },
  });

  return guardedJson("api.content.schema", {
    ok: true,
    sample,
    ts: Date.now(),
  });
}
