import { guardedJson } from "@/lib/api/guardedJson";
import { ingestAllSignalProviders } from "@/lib/signals/core/providerRegistry";
import { dedupeSignals } from "@/lib/signals/core/dedupe";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || "3");
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(10, limitRaw)) : 3;

  const providerResults = await ingestAllSignalProviders(limit);
  const allSignals = providerResults.flatMap((item) => item.signals);
  const deduped = dedupeSignals(allSignals);

  return guardedJson("api.signals.dedupe", {
    ok: true,
    providerCount: providerResults.length,
    totalIn: deduped.totalIn,
    totalOut: deduped.totalOut,
    duplicatesRemoved: deduped.duplicatesRemoved,
    signals: deduped.signals,
    ts: Date.now(),
  });
}
