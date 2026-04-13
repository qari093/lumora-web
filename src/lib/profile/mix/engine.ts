export type FeedMixResult = {
  familiarRatio: number;
  discoveryRatio: number;
};

export function computeFeedMix(): FeedMixResult {
  return {
    familiarRatio: 0.75,
    discoveryRatio: 0.25,
  };
}
