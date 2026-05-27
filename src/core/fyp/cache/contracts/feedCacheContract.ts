import type {
  FeedCacheEntry
} from "../types";

export function validateFeedCacheEntry(
  entry: FeedCacheEntry
): boolean {
  return Boolean(
    entry.key &&
      entry.payloadHash &&
      Number.isFinite(entry.ttlMs) &&
      Number.isFinite(entry.createdAt) &&
      entry.ttlMs > 0 &&
      entry.createdAt > 0
  );
}
