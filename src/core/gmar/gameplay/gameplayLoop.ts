export function completeGmarObjective(input: any) {
  const state = input?.state;
  const missions = Array.isArray(state?.missions) ? state.missions : [];
  const rewards = Array.isArray(state?.rewards) ? state.rewards : [];
  const mission = missions.find((m: any) => m.missionId === input?.missionId);
  if (!mission) throw new Error("GMAR mission not found.");
  if (mission.rewardClaimed) throw new Error("GMAR mission reward already claimed.");

  const completedMission = { ...mission, completed: true, rewardClaimed: true };
  const rewardsGranted = [
    { id: `xp_${mission.missionId}`, type: "xp", amount: 25 },
    { id: `zencoin_${mission.missionId}`, type: "zencoin", amount: 10 }
  ];

  return {
    completedMission,
    rewardsGranted,
    state: {
      ...state,
      player: { ...state.player, xp: Number(state.player?.xp ?? 0) + 25 },
      missions: missions.map((m: any) => m.missionId === mission.missionId ? completedMission : m),
      rewards: [...rewards, ...rewardsGranted]
    }
  };
}

export function assertGmarObjectiveCompletion(result: any): boolean {
  return Boolean(result?.completedMission?.completed && result?.rewardsGranted?.length === 2);
}

export function assertGmarGameplayCompletion(result: any): boolean {
  return Boolean(
    result &&
    result.completedMission &&
    result.completedMission.completed === true &&
    result.completedMission.rewardClaimed === true &&
    result.state &&
    result.state.player &&
    typeof result.state.player.playerId === "string" &&
    Array.isArray(result.rewardsGranted) &&
    result.rewardsGranted.length === 2 &&
    result.rewardsGranted[0]?.type === "xp" &&
    result.rewardsGranted[1]?.type === "zencoin"
  );
}
