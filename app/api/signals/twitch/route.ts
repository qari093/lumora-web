import { guardedJson } from "@/lib/api/guardedJson";
import { ingestTwitchSignals } from "@/lib/signals/providers/twitch";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || "10");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 10;

  const result = await ingestTwitchSignals({
    limit,
    useFixtureOnFailure: true,
  });

  return guardedJson("api.signals.twitch", {
    ok: result.ok,
    provider: "twitch_category_spikes",
    source: result.source,
    count: result.count,
    signals: result.signals,
    warning: result.error || null,
    ts: Date.now(),
  });
}
