import { guardedJson } from "@/lib/api/guardedJson";
import { ingestTwitterXSignals } from "@/lib/signals/providers/twitterX";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || "10");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 10;

  const result = await ingestTwitterXSignals({
    limit,
    useFixtureOnFailure: true,
  });

  return guardedJson("api.signals.twitter-x", {
    ok: result.ok,
    provider: "twitter_x_api",
    source: result.source,
    count: result.count,
    signals: result.signals,
    warning: result.error || null,
    ts: Date.now(),
  });
}
