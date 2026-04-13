import { guardedJson } from "@/lib/api/guardedJson";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { filterSafeSignals } from "@/lib/safety/nsfw";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readSignalStore();
  const { safe, results } = filterSafeSignals(snapshot.signals);

  return guardedJson("api.safety.nsfw", {
    ok: true,
    totalIn: snapshot.signals.length,
    totalOut: safe.length,
    blocked: results.filter(r => r.blocked).length,
    ts: Date.now(),
  });
}
