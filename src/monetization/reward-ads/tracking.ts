export type RewardAdEvent = {
  eventType: "reward_ad.offered" | "reward_ad.started" | "reward_ad.completed" | "reward_ad.dismissed";
  adId: string;
  userId: string;
  timestamp: string;
  rewardZen?: number;
};

export function createRewardAdEvent(input: Omit<RewardAdEvent, "timestamp"> & { timestamp?: string }): RewardAdEvent {
  return {
    ...input,
    timestamp: input.timestamp || new Date().toISOString(),
  };
}
