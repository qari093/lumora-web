import { guardedJson } from "@/lib/api/guardedJson";
import { detectBotPatterns } from "@/lib/trust/botPatterns";
import { readEnrichedSignalStore } from "@/lib/intelligence/storage/enrichedStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readEnrichedSignalStore();
  const signals = Array.isArray(snapshot.signals) ? snapshot.signals : [];

  const results = signals.slice(0, 50).map(detectBotPatterns);

  return guardedJson("api.trust.bot-patterns", {
    ok: true,
    checked: results.length,
    flagged: results.filter((r) => r.isBotLikely).length,
    results,
    ts: Date.now(),
  });
}
