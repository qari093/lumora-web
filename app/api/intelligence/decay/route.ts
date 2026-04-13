import { guardedJson } from "@/lib/api/guardedJson";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { annotateDecayBatch } from "@/lib/intelligence/decay";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readSignalStore();
  const annotated = annotateDecayBatch(snapshot.signals);

  return guardedJson("api.intelligence.decay", {
    ok: true,
    count: annotated.length,
    signals: annotated,
    ts: Date.now(),
  });
}
