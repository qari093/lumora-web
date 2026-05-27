import type { SourceAdapter } from "./adapterTypes";
import { buildAdapterClip } from "./adapterTypes";

export const CULTURAL_LIBRARY_ADAPTERS: SourceAdapter[] = [
  "europeana",
  "open-images",
  "wikimedia",
  "euscreen",
  "padma",
  "wellcome",
  "digitalnz",
  "aodl",
].map((id) => ({
  id,
  name: id,
  group: "cultural-library" as const,
  enabled: true,
  fetch: async () => [
    buildAdapterClip({
      id: `${id}-seed-1`,
      title: `${id} culture clip`,
      source: id,
      license: "CC BY 4.0",
      sourceUrl: `https://example.com/${id}`,
      playableUrl: `https://example.com/${id}.mp4`,
      mimeType: "video/mp4",
      hasAudio: true,
      durationSeconds: 30,
    }),
  ],
}));
