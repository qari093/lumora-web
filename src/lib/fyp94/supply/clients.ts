import type { Fyp94RawSupplyClip, Fyp94SupplyClient } from "./contracts";
import { filterFyp94VerticalMp4SupplyClips } from "./verticalGuard";

function demoClip(source: Fyp94SupplyClient["source"], query: string, index: number): Fyp94RawSupplyClip {
  return {
    externalId: `${source}_${query}_${index}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
    source,
    title: `${source} ${query} clip ${index + 1}`,
    sourceUrl: `https://example.com/${source}/${index}`,
    mp4Url: `https://cdn.example.com/${source}/${index}.mp4`,
    posterUrl: `https://cdn.example.com/${source}/${index}.jpg`,
    width: 720,
    height: 1280,
    durationSeconds: 18,
    tags: [query, source],
    licenseUrl: `https://example.com/${source}/license`,
  };
}

export function createFyp94SupplyClient(source: Fyp94SupplyClient["source"]): Fyp94SupplyClient {
  return {
    source,
    async search(input) {
      const clips = Array.from({ length: Math.max(0, input.limit) }).map((_, index) =>
        demoClip(source, input.query, index),
      );

      if (source === "coverr") {
        return filterFyp94VerticalMp4SupplyClips(clips);
      }

      return clips;
    },
  };
}
