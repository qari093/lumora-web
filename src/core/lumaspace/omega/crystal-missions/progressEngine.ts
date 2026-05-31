import type { CrystalMission, MissionContribution } from "./types";

export function createMissionContribution(input: {
  missionId: string;
  citizenId: string;
  amount: number;
  note?: string;
}): MissionContribution {
  if (!input.missionId.trim()) throw new Error("missionId_required");
  if (!input.citizenId.trim()) throw new Error("citizenId_required");
  if (input.amount <= 0) throw new Error("amount_invalid");

  return {
    id: `mission_contribution_${input.missionId}_${input.citizenId}_${Date.now()}`,
    missionId: input.missionId,
    citizenId: input.citizenId,
    amount: input.amount,
    note: input.note ?? "",
  };
}

export function applyMissionContribution(
  mission: CrystalMission,
  contribution: MissionContribution,
): CrystalMission {
  if (mission.id !== contribution.missionId) throw new Error("mission_mismatch");
  if (mission.status !== "active") throw new Error("mission_not_active");

  const progress = Math.min(mission.target, mission.progress + contribution.amount);
  const participantIds = Array.from(new Set([...mission.participantIds, contribution.citizenId]));
  const next = { ...mission, progress, participantIds };

  return progress >= mission.target
    ? { ...next, status: "completed", memoryUnlockId: next.memoryUnlockId ?? `mission_memory_${mission.id}` }
    : next;
}

export function missionProgressPercent(mission: CrystalMission): number {
  return Math.round((mission.progress / mission.target) * 100);
}
