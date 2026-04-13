import type { SafeSeedRegistryEntry } from "./safeSeedRegistry";
import type { TrendCardSchema } from "./trendCardSchema";
import type { MetadataOnlyCardSchema } from "./metadataCardSchema";
import type { TeaserCardSchema } from "./teaserCardSchema";

export type BlendableCard =
  | TeaserCardSchema
  | MetadataOnlyCardSchema
  | TrendCardSchema;

export type BlendableSourceEntry = {
  source: "safe-seed" | "official-teaser" | "metadata-fallback" | "trend-signal";
  priority: number;
  card: BlendableCard;
};

export function toBlendableSourceEntries(
  safeSeeds: SafeSeedRegistryEntry[],
  trends: TrendCardSchema[]
): BlendableSourceEntry[] {
  const seedEntries: BlendableSourceEntry[] = safeSeeds.map((entry) => ({
    source:
      entry.card.type === "teaser"
        ? "official-teaser"
        : entry.card.type === "metadata"
        ? "metadata-fallback"
        : "safe-seed",
    priority: entry.priority,
    card: entry.card,
  }));

  const trendEntries: BlendableSourceEntry[] = trends.map((card, index) => ({
    source: "trend-signal",
    priority: 1000 + index,
    card,
  }));

  return [...seedEntries, ...trendEntries];
}

export function blendFypSources(
  entries: BlendableSourceEntry[]
): BlendableCard[] {
  return [...entries]
    .sort((a, b) => a.priority - b.priority)
    .map((entry) => entry.card);
}
