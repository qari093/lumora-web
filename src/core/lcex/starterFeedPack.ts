import type { SafeSeedRegistryEntry } from "./safeSeedRegistry";
import { registerSafeSeed } from "./safeSeedRegistry";

export const CURATED_STARTER_FEED_PACK: SafeSeedRegistryEntry[] = [
  {
    id: "starter-movie-teaser-001",
    bucket: "starter",
    priority: 10,
    active: true,
    tags: ["movie", "official", "starter"],
    card: {
      id: "starter-movie-teaser-001",
      type: "teaser",
      title: "Starter Movie Teaser",
      subtitle: "Curated launch-safe film discovery seed",
      sourceName: "Lumora Editorial",
      category: "movie",
      language: "en",
      region: "global",
      trustScore: 95,
    },
  },
  {
    id: "starter-series-metadata-001",
    bucket: "starter",
    priority: 20,
    active: true,
    tags: ["series", "metadata", "starter"],
    card: {
      id: "starter-series-metadata-001",
      type: "metadata",
      title: "Starter Series Reveal",
      subtitle: "Metadata-safe launch seed",
      sourceName: "Lumora Editorial",
      category: "series",
      language: "en",
      region: "global",
      trustScore: 90,
      fallbackReason: "missing_media",
    },
  },
  {
    id: "starter-trend-001",
    bucket: "editorial",
    priority: 30,
    active: true,
    tags: ["trend", "starter", "heat"],
    card: {
      id: "starter-trend-001",
      type: "trend",
      title: "What’s Heating Now",
      summary: "Curated early-signal starter trend for launch-safe discovery.",
      category: "cross-media",
      signalSource: "editorial",
      trendScore: 78,
      confidenceScore: 82,
      culturalConfidence: "medium",
      detectedAt: new Date(0).toISOString(),
    },
  },
];

export function seedCuratedStarterFeedPack(): SafeSeedRegistryEntry[] {
  for (const entry of CURATED_STARTER_FEED_PACK) {
    registerSafeSeed(entry);
  }
  return CURATED_STARTER_FEED_PACK;
}
