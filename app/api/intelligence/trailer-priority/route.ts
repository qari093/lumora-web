import { guardedJson } from "@/lib/api/guardedJson";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { annotateTrailerPriorityBatch } from "@/lib/intelligence/trailerPriority";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readSignalStore();
  const annotated = annotateTrailerPriorityBatch(snapshot.signals);

  return guardedJson("api.intelligence.trailer-priority", {
    ok: true,
    count: annotated.length,
    signals: annotated,
    ts: Date.now(),
  });
}
