import type {
  FanEngagement,
  FanRankProfile,
  FandomRank
} from "./types";

export function calculateFanLoyaltyScore(
  engagement: FanEngagement
): number {
  return (
    engagement.secondsWatched * 0.02 +
    engagement.echoCount * 3 +
    engagement.capsuleSaves * 8 +
    engagement.liveRoomJoins * 12
  );
}

export function calculateFandomRank(score: number): FandomRank {
  if (score >= 1000) return "volt-elite";
  if (score >= 999) return "blaze-cultist";
  if (score >= 200) return "spark-loyalist";
  return "wire-follower";
}

export function createFanRankProfile(
  engagement: FanEngagement
): FanRankProfile {
  if (!engagement.fanId.trim() || !engagement.creatorId.trim()) {
    throw new Error("Fan rank requires fanId and creatorId.");
  }

  const loyaltyScore = calculateFanLoyaltyScore(engagement);

  return {
    ...engagement,
    loyaltyScore,
    rank: calculateFandomRank(loyaltyScore)
  };
}
