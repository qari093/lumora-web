import type { PurposeMatch, PurposeMission, PurposeReward } from "./types";

export function createPurposeReward(match: PurposeMatch, mission: PurposeMission): PurposeReward {
  return {
    id: `purpose_reward_${mission.id}`,
    missionId: mission.id,
    citizenIds: [match.citizenA, match.citizenB],
    rewardKind: mission.progress >= 100 ? "shared_memory" : "tree_bloom",
    unlocked: mission.progress >= 100,
  };
}
