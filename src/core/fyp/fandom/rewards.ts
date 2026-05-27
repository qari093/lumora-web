import type {
  FanRankProfile,
  FandomReward
} from "./types";

export function createFandomReward(input: {
  profile: FanRankProfile;
  type: FandomReward["type"];
}): FandomReward {
  const eligible =
    input.profile.rank === "blaze-cultist" ||
    input.profile.rank === "volt-elite";

  return {
    rewardId: `fandom_reward_${input.profile.fanId}_${input.profile.creatorId}_${input.type}`,
    fanId: input.profile.fanId,
    creatorId: input.profile.creatorId,
    type: input.type,
    unlocked: eligible
  };
}
