import type { SourceAdapter } from "./adapterTypes";
import { buildAdapterClip } from "./adapterTypes";

export const EXTRA_APPROVED_ADAPTERS: SourceAdapter[] = [
  "noaa",
  "usgs",
  "wellcome",
  "europeana-extra",
  "open-images-extra",
].map((id) => ({
  id,
  name: id,
  group: "archive-government" as const,
  enabled: true,
  fetch: async () => [
    buildAdapterClip({
      id: `${id}-seed-1`,
      title: `${id} approved clip`,
      source: id,
      license: "public domain",
      sourceUrl: `https://example.com/${id}`,
      playableUrl: `https://example.com/${id}.mp4`,
      mimeType: "video/mp4",
      hasAudio: true,
      durationSeconds: 30,
    }),
  ],
}));
