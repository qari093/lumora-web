import type {
  GmarGameState,
  GmarMissionState,
  GmarRewardLedgerEntry
} from "@/src/core/gmar/state/gameState";

export type GmarObjectiveCompletionResult = {
  state: GmarGameState;
  completedMission: GmarMissionState;
  rewardsGranted: GmarRewardLedgerEntry[];
};

export function completeGmarObjective(input: {
  state: GmarGameState;
  missionId: string;
  now?: Date;
}): GmarObjectiveCompletionResult {
  const now = input.now ?? new Date();
  const iso = now.toISOString();

  const mission = input.state.missions.find(
    item => item.missionId === input.missionId
  );

  if (!mission) {
    throw new Error("GMAR mission not found.");
  }

  if (mission.rewardClaimed) {
    throw new Error("GMAR mission reward already claimed.");
  }

  const completedMission: GmarMissionState = {
    ...mission,
    progress: mission.target,
    completed: true,
    rewardClaimed: true
  };

  const xpReward: GmarRewardLedgerEntry = {
    id: `${mission.missionId}_xp_${now.getTime()}`,
    type: "xp",
    amount: 25,
    reason: `Completed mission: ${mission.title}`,
    createdAt: iso
  };

  const zencoinReward: GmarRewardLedgerEntry = {
    id: `${mission.missionId}_zencoin_${now.getTime()}`,
    type: "zencoin",
    amount: 5,
    reason: `Completed mission: ${mission.title}`,
    createdAt: iso
  };

  const updatedState: GmarGameState = {
    ...input.state,
    player: {
      ...input.state.player,
      xp: input.state.player.xp + xpReward.amount,
      updatedAt: iso
    },
    missions: input.state.missions.map(item =>
      item.missionId === mission.missionId ? completedMission : item
    ),
    rewards: [
      ...input.state.rewards,
      xpReward,
      zencoinReward
    ],
    updatedAt: iso
  };

  return {
    state: updatedState,
    completedMission,
    rewardsGranted: [xpReward, zencoinReward]
  };
}

export function assertGmarGameplayCompletion(
  result: GmarObjectiveCompletionResult
): true {
  if (
    result.completedMission.completed !== true ||
    result.completedMission.rewardClaimed !== true ||
    result.rewardsGranted.length !== 2 ||
    result.state.player.xp < 25
  ) {
    throw new Error("Invalid GMAR gameplay completion.");
  }

  return true;
}
