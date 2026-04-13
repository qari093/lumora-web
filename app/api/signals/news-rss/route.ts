import { guardedJson } from "@/lib/api/guardedJson";
import { ingestNewsRssSignals } from "@/lib/signals/providers/newsRss";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || "10");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 10;

  const result = await ingestNewsRssSignals({
    limit,
    useFixtureOnFailure: true,
  });

  return guardedJson("api.signals.news-rss", {
    ok: result.ok,
    provider: "news_rss",
    source: result.source,
    count: result.count,
    signals: result.signals,
    warning: result.error || null,
    ts: Date.now(),
  });
}
