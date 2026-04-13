import { guardedJson } from "@/lib/api/guardedJson";
import { readEnrichedSignalStore } from "@/lib/intelligence/storage/enrichedStore";
import { detectMisinformationBatch } from "@/lib/trust/misinformation";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readEnrichedSignalStore();
  const signals = Array.isArray(snapshot.signals) ? snapshot.signals : [];
  const results = detectMisinformationBatch(signals.slice(0, 50));

  return guardedJson("api.trust.misinformation", {
    ok: true,
    checked: results.length,
    tagged: results.filter((r) => r.tagged).length,
    results,
    ts: Date.now(),
  });
}
