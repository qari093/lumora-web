import { guardedJson } from "@/lib/api/guardedJson";
import { ingestGoogleTrendsSignals } from "@/lib/signals/providers/googleTrends";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || "10");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 10;

  const result = await ingestGoogleTrendsSignals({
    limit,
    useFixtureOnFailure: true,
  });

  return guardedJson("api.signals.google-trends", {
    ok: result.ok,
    provider: "google_trends",
    source: result.source,
    count: result.count,
    signals: result.signals,
    warning: result.error || null,
    ts: Date.now(),
  });
}
