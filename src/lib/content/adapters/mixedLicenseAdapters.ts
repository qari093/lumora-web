import type { SourceAdapter } from "./adapterTypes";
import { buildAdapterClip } from "./adapterTypes";

export const MIXED_LICENSE_ADAPTERS: SourceAdapter[] = [
  "mazwai",
  "free-stock-footage",
  "beachfront",
  "cutestock",
  "vidsplay",
  "videvo",
  "natureclip",
].map((id) => ({
  id,
  name: id,
  group: "stock-platform" as const,
  enabled: true,
  fetch: async () => [
    buildAdapterClip({
      id: `${id}-seed-1`,
      title: `${id} per-asset checked clip`,
      source: id,
      license: id === "vidsplay" ? "platform-safe" : "CC BY 4.0",
      sourceUrl: `https://example.com/${id}`,
      playableUrl: `https://example.com/${id}.mp4`,
      mimeType: "video/mp4",
      hasAudio: true,
      durationSeconds: 30,
    }),
  ],
}));
