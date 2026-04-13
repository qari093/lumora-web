import { guardedJson } from "@/lib/api/guardedJson";
import { detectFakeEngagement } from "@/lib/trust/fakeEngagement";
import { readEnrichedSignalStore } from "@/lib/intelligence/storage/enrichedStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readEnrichedSignalStore();
  const signals = Array.isArray(snapshot.signals) ? snapshot.signals : [];

  const results = signals.slice(0, 20).map(detectFakeEngagement);

  return guardedJson("api.trust.fake-engagement", {
    ok: true,
    checked: results.length,
    suspicious: results.filter(r => r.isSuspicious).length,
    results,
    ts: Date.now(),
  });
}
