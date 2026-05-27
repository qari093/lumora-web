export interface FeedCacheEntry {
  key: string;
  payloadHash: string;
  ttlMs: number;
  createdAt: number;
}

export interface FeedCacheDecision {
  key: string;
  hit: boolean;
  expired: boolean;
  reason: string;
}
