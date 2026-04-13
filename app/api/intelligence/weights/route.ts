import { guardedJson } from "@/lib/api/guardedJson";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { applySignalWeights } from "@/lib/intelligence/weights";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readSignalStore();
  const weighted = applySignalWeights(snapshot.signals);

  return guardedJson("api.intelligence.weights", {
    ok: true,
    count: weighted.length,
    signals: weighted,
    ts: Date.now(),
  });
}
