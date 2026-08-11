import { guardedJson } from "@/lib/api/guardedJson";
import { buildBaseContent } from "@/lib/content/schema";
import { attachTrustScore } from "@/lib/content/trust";
import { readTrustedSignalStore } from "@/lib/trust/filterLowTrust";

export const dynamic = "force-dynamic";

export async function GET() {
  const trusted = await readTrustedSignalStore();
  const first = Array.isArray(trusted.signals) && trusted.signals.length ? trusted.signals[0] as any : null;

  const base = buildBaseContent({
    id: "content_trust_sample_001",
    title: first?.title || "Trust Sample",
    summary: first?.summary || "Trust attachment sample",
  });

  const content = attachTrustScore(base, {
    trustScore: typeof first?.trustScore === "number" ? first.trustScore : 100,
    trustLevel: first?.trustLevel || "high",
  });

  return guardedJson("api.content.trust", {
    ok: true,
    content,
    ts: Date.now(),
  });
}
