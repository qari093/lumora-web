import { guardedJson } from "@/lib/api/guardedJson";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { annotateCultureBatch } from "@/lib/intelligence/culture";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readSignalStore();
  const annotated = annotateCultureBatch(snapshot.signals);

  return guardedJson("api.intelligence.culture", {
    ok: true,
    count: annotated.length,
    signals: annotated,
    ts: Date.now(),
  });
}
