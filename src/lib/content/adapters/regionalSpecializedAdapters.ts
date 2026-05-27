import type { SourceAdapter } from "./adapterTypes";
import { buildAdapterClip } from "./adapterTypes";

export const REGIONAL_SPECIALIZED_ADAPTERS: SourceAdapter[] = [
  "aljazeera",
  "gongu",
  "clacso",
  "libreflix",
  "nhk",
  "nfsa",
].map((id) => ({
  id,
  name: id,
  group: "regional-specialized" as const,
  enabled: true,
  fetch: async () => [
    buildAdapterClip({
      id: `${id}-seed-1`,
      title: `${id} regional verified clip`,
      source: id,
      license: id === "gongu" ? "public domain" : "CC BY 4.0",
      sourceUrl: `https://example.com/${id}`,
      playableUrl: `https://example.com/${id}.mp4`,
      mimeType: "video/mp4",
      hasAudio: true,
      durationSeconds: 30,
    }),
  ],
}));
