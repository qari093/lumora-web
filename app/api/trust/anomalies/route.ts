import { guardedJson } from "@/lib/api/guardedJson";
import { readEnrichedSignalStore } from "@/lib/intelligence/storage/enrichedStore";
import { detectAnomalies } from "@/lib/trust/anomalyDetection";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readEnrichedSignalStore();
  const signals = Array.isArray(snapshot.signals) ? snapshot.signals : [];
  const results = detectAnomalies(signals.slice(0, 50));

  return guardedJson("api.trust.anomalies", {
    ok: true,
    checked: results.length,
    anomalous: results.filter((r) => r.isAnomalous).length,
    results,
    ts: Date.now(),
  });
}
