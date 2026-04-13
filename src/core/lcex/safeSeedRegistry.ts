import type { TeaserCardSchema } from "./teaserCardSchema";
import type { MetadataOnlyCardSchema } from "./metadataCardSchema";
import type { TrendCardSchema } from "./trendCardSchema";

export type SafeSeedCard =
  | TeaserCardSchema
  | MetadataOnlyCardSchema
  | TrendCardSchema;

export type SafeSeedBucket =
  | "starter"
  | "editorial"
  | "regional"
  | "fallback"
  | "evergreen";

export type SafeSeedRegistryEntry = {
  id: string;
  bucket: SafeSeedBucket;
  priority: number;
  active: boolean;
  card: SafeSeedCard;
  tags: string[];
};

export const SAFE_SEED_REGISTRY: SafeSeedRegistryEntry[] = [];

export function registerSafeSeed(entry: SafeSeedRegistryEntry): void {
  SAFE_SEED_REGISTRY.push(entry);
}

export function getActiveSafeSeeds(): SafeSeedRegistryEntry[] {
  return SAFE_SEED_REGISTRY
    .filter((entry) => entry.active)
    .sort((a, b) => a.priority - b.priority);
}

export function getSafeSeedsByBucket(
  bucket: SafeSeedBucket
): SafeSeedRegistryEntry[] {
  return getActiveSafeSeeds().filter((entry) => entry.bucket === bucket);
}
