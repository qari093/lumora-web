import { guardedJson } from "@/lib/api/guardedJson";
import { buildBaseContent } from "@/lib/content/schema";
import { attachSignalOrigin } from "@/lib/content/origin";
import { readTrustedSignalStore } from "@/lib/trust/filterLowTrust";

export const dynamic = "force-dynamic";

export async function GET() {
  const trusted = await readTrustedSignalStore();
  const first = Array.isArray(trusted.signals) && trusted.signals.length ? trusted.signals[0] as any : null;

  const base = buildBaseContent({
    id: "content_origin_sample_001",
    title: first?.title || "Origin Sample",
    summary: first?.summary || "Signal origin attachment sample",
  });

  const content = attachSignalOrigin(base, {
    id: first?.id,
    platform: first?.platform,
    language: first?.language,
    region: first?.region,
    createdAt: first?.createdAt,
    updatedAt: first?.updatedAt,
  });

  return guardedJson("api.content.origin", {
    ok: true,
    content,
    ts: Date.now(),
  });
}
