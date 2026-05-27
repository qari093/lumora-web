import { fetchAllSources } from "@/src/lib/content/sources/fetchAll";
import { runLumoraPipeline } from "./runPipeline";

export async function fetchProcessPipeline() {
  const raw = await fetchAllSources();

  const normalized = raw.map((r: any) => ({
    id: r.id,
    title: r.title,
    source: r.source,
    license: r.license,
    sourceUrl: r.sourceUrl || "",
    playableUrl: r.playableUrl,
    hasAudio: r.hasAudio,
    durationSeconds: r.durationSeconds || 20,
    mimeType: "video/mp4",
  }));

  return runLumoraPipeline(normalized);
}
