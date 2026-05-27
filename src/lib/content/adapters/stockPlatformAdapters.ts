import type { SourceAdapter } from "./adapterTypes";
import { buildAdapterClip } from "./adapterTypes";

export const STOCK_PLATFORM_ADAPTERS: SourceAdapter[] = [
  "pexels",
  "pixabay",
  "coverr",
  "mixkit",
  "dareful",
  "distill",
  "life-of-vids",
  "splitshire",
  "free-nature",
].map((id) => ({
  id,
  name: id,
  group: "stock-platform" as const,
  enabled: true,
  fetch: async () => [
    buildAdapterClip({
      id: `${id}-seed-1`,
      title: `${id} safe stock clip`,
      source: id,
      license: id === "dareful" ? "CC BY 4.0" : "CC0",
      sourceUrl: `https://example.com/${id}`,
      playableUrl: `https://example.com/${id}.mp4`,
      mimeType: "video/mp4",
      hasAudio: true,
      durationSeconds: 30,
    }),
  ],
}));
