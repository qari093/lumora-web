import { fetchFromAllAdapters } from "@/src/lib/content/adapters/allAdapters";
import { runLumoraPipeline } from "@/src/lib/content/pipeline/runPipeline";

export async function buildRuntimeMultiSource() {
  const raw = await fetchFromAllAdapters();
  const result = runLumoraPipeline(raw as any);

  return {
    rawCount: raw.length,
    acceptedCount: result.accepted.length,
    rejectedCount: result.rejected.length,
    accepted: result.accepted,
    rejected: result.rejected,
  };
}
