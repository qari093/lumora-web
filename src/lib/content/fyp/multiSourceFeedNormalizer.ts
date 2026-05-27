import type { RawSourceClip } from "@/src/lib/content/pipeline/types";

export type MultiSourceFypItem = {
  id: string;
  title: string;
  category: string;
  source: string;
  sourceType: "multi-source";
  playbackUrl: string;
  hasAudio: true;
  license: string;
  sourceUrl: string;
};

export function normalizeMultiSourceForFyp(items: RawSourceClip[]): MultiSourceFypItem[] {
  return items
    .filter((item) => Boolean(item.playableUrl || item.localUrl || item.embedUrl))
    .filter((item) => item.hasAudio === true)
    .map((item) => ({
      id: `multi_${item.source}_${item.id}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
      title: item.title || "Lumora Clip",
      category: "Multi-Source",
      source: item.source,
      sourceType: "multi-source",
      playbackUrl: item.playableUrl || item.localUrl || item.embedUrl || "",
      hasAudio: true,
      license: item.license,
      sourceUrl: item.sourceUrl || "",
    }));
}
