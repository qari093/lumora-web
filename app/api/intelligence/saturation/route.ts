import { guardedJson } from "@/lib/api/guardedJson";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { annotateSaturationBatch } from "@/lib/intelligence/saturation";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readSignalStore();
  const annotated = annotateSaturationBatch(snapshot.signals);

  return guardedJson("api.intelligence.saturation", {
    ok: true,
    count: annotated.length,
    signals: annotated,
    ts: Date.now(),
  });
}
