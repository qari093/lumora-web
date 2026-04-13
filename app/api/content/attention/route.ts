import { guardedJson } from "@/lib/api/guardedJson";
import { buildBaseContent } from "@/lib/content/schema";
import { attachAttentionMetrics } from "@/lib/content/attention";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = buildBaseContent({
    id: "content_attention_sample",
    title: "Attention Sample"
  });

  const content = attachAttentionMetrics(base, {
    attentionScore: 82,
    velocityScore: 65
  });

  return guardedJson("api.content.attention", { ok: true, content, ts: Date.now() });
}
