import type { SourceAdapter } from "./adapterTypes";
import { buildAdapterClip } from "./adapterTypes";

export const ARCHIVE_GOVERNMENT_ADAPTERS: SourceAdapter[] = [
  "internet-archive",
  "prelinger",
  "fedflix",
  "loc",
  "smithsonian",
  "pdr",
  "pond5",
  "prasar",
].map((id) => ({
  id,
  name: id,
  group: "archive-government" as const,
  enabled: true,
  fetch: async () => [
    buildAdapterClip({
      id: `${id}-seed-1`,
      title: `${id} verified clip`,
      source: id,
      license: id === "smithsonian" ? "CC0" : "public domain",
      sourceUrl: `https://example.com/${id}`,
      playableUrl: `https://example.com/${id}.mp4`,
      mimeType: "video/mp4",
      hasAudio: true,
      durationSeconds: 30,
    }),
  ],
}));
