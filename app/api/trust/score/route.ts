import { guardedJson } from "@/lib/api/guardedJson";
import { readEnrichedSignalStore } from "@/lib/intelligence/storage/enrichedStore";
import { computeTrustBatch } from "@/lib/trust/trustScore";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readEnrichedSignalStore();
  const signals = Array.isArray(snapshot.signals) ? snapshot.signals : [];
  const results = computeTrustBatch(signals.slice(0, 50));

  return guardedJson("api.trust.score", {
    ok: true,
    checked: results.length,
    blocked: results.filter((r) => r.trustLevel === "blocked").length,
    low: results.filter((r) => r.trustLevel === "low").length,
    results,
    ts: Date.now(),
  });
}
