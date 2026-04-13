import { guardedJson } from "@/lib/api/guardedJson";
import { ingestRedditSignals } from "@/lib/signals/providers/reddit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || "10");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 10;

  const result = await ingestRedditSignals({
    limit,
    useFixtureOnFailure: true,
  });

  return guardedJson("api.signals.reddit", {
    ok: result.ok,
    provider: "reddit_api",
    source: result.source,
    count: result.count,
    signals: result.signals,
    warning: result.error || null,
    ts: Date.now(),
  });
}
