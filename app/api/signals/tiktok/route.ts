import { guardedJson } from "@/lib/api/guardedJson";
import { ingestTikTokSignals } from "@/lib/signals/providers/tiktok";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || "10");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 10;

  const result = await ingestTikTokSignals({
    limit,
    useFixtureOnFailure: true,
  });

  return guardedJson("api.signals.tiktok", {
    ok: result.ok,
    provider: "tiktok_metadata_only",
    source: result.source,
    count: result.count,
    signals: result.signals,
    warning: result.error || null,
    ts: Date.now(),
  });
}
