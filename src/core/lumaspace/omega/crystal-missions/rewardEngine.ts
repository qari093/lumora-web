import type { CrystalMission, MissionReward } from "./types";

export function distributeMissionRewards(mission: CrystalMission): MissionReward[] {
  if (mission.status !== "completed") throw new Error("mission_not_completed");

  const participants = mission.participantIds.length > 0 ? mission.participantIds : [];
  const each = participants.length === 0 ? 0 : Math.floor(mission.zencoinPool / participants.length);

  return participants.map((citizenId) => ({
    id: `mission_reward_${mission.id}_${citizenId}`,
    missionId: mission.id,
    citizenId,
    zencoinAmount: each,
    memoryUnlocked: Boolean(mission.memoryUnlockId),
  }));
}
