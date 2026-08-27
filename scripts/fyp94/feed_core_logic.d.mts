export type Fyp94FeedCoreItem = {
  id: string;
  [key: string]: unknown;
};

export function createSessionSeed(now?: number): number;

export function stableShuffle<T extends Fyp94FeedCoreItem>(
  items: readonly T[],
  seed?: number,
): T[];

export function filterRecentlySeen<T extends Fyp94FeedCoreItem>(
  items: readonly T[],
  seenIds?: readonly string[],
  fallbackMin?: number,
): T[];

export function enforceNoSameItemRepetition<T extends Fyp94FeedCoreItem>(
  items: readonly T[],
): T[];

export function buildCoreFeed<T extends Fyp94FeedCoreItem>(
  items: readonly T[],
  seenIds?: readonly string[],
  seed?: number,
): T[];
