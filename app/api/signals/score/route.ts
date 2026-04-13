import { guardedJson } from "@/lib/api/guardedJson";
import { ingestAllSignalProviders } from "@/lib/signals/core/providerRegistry";
import { dedupeSignals } from "@/lib/signals/core/dedupe";
import { scoreSignals } from "@/lib/signals/core/score";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || "3");
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(10, limitRaw)) : 3;

  const providerResults = await ingestAllSignalProviders(limit);
  const rawSignals = providerResults.flatMap((p) => p.signals);

  const deduped = dedupeSignals(rawSignals);
  const scored = scoreSignals(deduped.signals);

  return guardedJson("api.signals.score", {
    ok: true,
    totalIn: rawSignals.length,
    totalOut: scored.length,
    top: scored.slice(0, 10),
    ts: Date.now(),
  });
}
