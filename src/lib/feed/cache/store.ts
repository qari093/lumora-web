export type FeedCacheState = {
  key: string;
  ttlSec: number;
  strategy: "short-lived";
};

export function getFeedCacheState(): FeedCacheState {
  return {
    key: "feed:home:sample",
    ttlSec: 45,
    strategy: "short-lived",
  };
}
