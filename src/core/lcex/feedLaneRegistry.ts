export const FEED_LANES = [
  "safe-seed",
  "official-teasers",
  "metadata-fallback",
  "trend-signals",
  "editorial-heat",
  "premium-first10",
] as const;

export type FeedLaneId = typeof FEED_LANES[number];

export const FEED_LANE_REGISTRY: Record<
  FeedLaneId,
  {
    id: FeedLaneId;
    label: string;
    premium: boolean;
    order: number;
  }
> = {
  "safe-seed": {
    id: "safe-seed",
    label: "Safe Seed",
    premium: false,
    order: 1,
  },
  "official-teasers": {
    id: "official-teasers",
    label: "Official Teasers",
    premium: false,
    order: 2,
  },
  "metadata-fallback": {
    id: "metadata-fallback",
    label: "Metadata Fallback",
    premium: false,
    order: 3,
  },
  "trend-signals": {
    id: "trend-signals",
    label: "Trend Signals",
    premium: false,
    order: 4,
  },
  "editorial-heat": {
    id: "editorial-heat",
    label: "What's Heating",
    premium: false,
    order: 5,
  },
  "premium-first10": {
    id: "premium-first10",
    label: "Premium First 10",
    premium: true,
    order: 6,
  },
};

export function isFeedLaneId(value: string): value is FeedLaneId {
  return FEED_LANES.includes(value as FeedLaneId);
}

export function getFeedLane(id: FeedLaneId) {
  return FEED_LANE_REGISTRY[id];
}
