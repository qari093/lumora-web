import { guardedJson } from "@/lib/api/guardedJson";
import { buildBaseContent } from "@/lib/content/schema";
import { attachEmotionTags } from "@/lib/content/emotions";
import { readTrustedSignalStore } from "@/lib/trust/filterLowTrust";

export const dynamic = "force-dynamic";

export async function GET() {
  const trusted = await readTrustedSignalStore();
  const first = Array.isArray(trusted.signals) && trusted.signals.length ? trusted.signals[0] as any : null;

  const base = buildBaseContent({
    id: "content_emotions_sample_001",
    title: first?.title || "Emotion Sample",
    summary: first?.summary || "Emotion attachment sample",
  });

  const content = attachEmotionTags(base, Array.isArray(first?.derivedEmotionTags) ? first.derivedEmotionTags : (Array.isArray(first?.emotionTags) ? first.emotionTags : ["curiosity"]));

  return guardedJson("api.content.emotions", {
    ok: true,
    content,
    ts: Date.now(),
  });
}
