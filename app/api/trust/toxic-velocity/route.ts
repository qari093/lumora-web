import { guardedJson } from "@/lib/api/guardedJson";
import { readEnrichedSignalStore } from "@/lib/intelligence/storage/enrichedStore";
import { detectToxicVelocityBatch } from "@/lib/trust/toxicVelocity";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readEnrichedSignalStore();
  const signals = Array.isArray(snapshot.signals) ? snapshot.signals : [];
  const results = detectToxicVelocityBatch(signals.slice(0, 50));

  return guardedJson("api.trust.toxic-velocity", {
    ok: true,
    checked: results.length,
    flagged: results.filter((r) => r.flagged).length,
    results,
    ts: Date.now(),
  });
}
