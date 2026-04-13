import { guardedJson } from "@/lib/api/guardedJson";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { annotateGravityBatch } from "@/lib/intelligence/gravity";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readSignalStore();
  const annotated = annotateGravityBatch(snapshot.signals);

  return guardedJson("api.intelligence.gravity", {
    ok: true,
    count: annotated.length,
    signals: annotated,
    ts: Date.now(),
  });
}
