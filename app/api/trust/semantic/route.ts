import { guardedJson } from "@/lib/api/guardedJson";
import { readEnrichedSignalStore } from "@/lib/intelligence/storage/enrichedStore";
import { semanticValidateBatch } from "@/lib/trust/semanticValidation";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readEnrichedSignalStore();
  const signals = Array.isArray(snapshot.signals) ? snapshot.signals : [];
  const results = semanticValidateBatch(signals.slice(0, 50));

  return guardedJson("api.trust.semantic", {
    ok: true,
    checked: results.length,
    blocked: results.filter((r) => r.verdict === "block").length,
    review: results.filter((r) => r.verdict === "review").length,
    results,
    ts: Date.now(),
  });
}
