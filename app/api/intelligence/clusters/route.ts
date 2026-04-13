import { guardedJson } from "@/lib/api/guardedJson";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { filterFreshSignals } from "@/lib/signals/core/freshness";
import { clusterSignals } from "@/lib/intelligence/clustering";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readSignalStore();
  const fresh = filterFreshSignals(snapshot.signals);
  const clusters = clusterSignals(fresh);

  return guardedJson("api.intelligence.clusters", {
    ok: true,
    signalCount: fresh.length,
    clusterCount: clusters.length,
    clusters,
    ts: Date.now(),
  });
}
