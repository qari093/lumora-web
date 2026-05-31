import type { WisdomBeacon, WisdomChallenge, WisdomReward } from "./types";
import { completeWisdomChallenge } from "./challengeEngine";

export function createWisdomReward(input: {
  beacon: WisdomBeacon;
  challenge?: WisdomChallenge;
}): WisdomReward {
  const challengeUnlocked = input.challenge
    ? completeWisdomChallenge({
        challenge: input.challenge,
        appreciationCount: input.beacon.appreciationCount,
      })
    : false;

  const unlocked = input.beacon.appreciationCount > 0 || challengeUnlocked;

  return {
    id: `wisdom_reward_${input.beacon.authorId}_${input.beacon.id}`,
    citizenId: input.beacon.authorId,
    beaconId: input.beacon.id,
    rewardKind: challengeUnlocked ? "lamp_of_wisdom" : unlocked ? "tree_bloom" : "zencoin_micro_reward",
    unlocked,
  };
}
