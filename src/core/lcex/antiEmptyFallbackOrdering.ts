import type { SafeSeedRegistryEntry } from "./safeSeedRegistry";

export const ANTI_EMPTY_FALLBACK_ORDER = [
  "starter",
  "editorial",
  "regional",
  "fallback",
  "evergreen",
] as const;

export type AntiEmptyFallbackBucket = typeof ANTI_EMPTY_FALLBACK_ORDER[number];

export function applyAntiEmptyFallbackOrdering(
  entries: SafeSeedRegistryEntry[]
): SafeSeedRegistryEntry[] {
  const active = entries.filter((entry) => entry.active);

  return [...active].sort((a, b) => {
    const bucketDelta =
      ANTI_EMPTY_FALLBACK_ORDER.indexOf(a.bucket as AntiEmptyFallbackBucket) -
      ANTI_EMPTY_FALLBACK_ORDER.indexOf(b.bucket as AntiEmptyFallbackBucket);

    if (bucketDelta !== 0) return bucketDelta;
    return a.priority - b.priority;
  });
}

export function ensureNonEmptyFeed(
  entries: SafeSeedRegistryEntry[],
  fallbackEntries: SafeSeedRegistryEntry[]
): SafeSeedRegistryEntry[] {
  const orderedPrimary = applyAntiEmptyFallbackOrdering(entries);
  if (orderedPrimary.length > 0) return orderedPrimary;
  return applyAntiEmptyFallbackOrdering(fallbackEntries);
}
