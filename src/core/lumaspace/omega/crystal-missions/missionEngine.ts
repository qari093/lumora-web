import type { CrystalMission, CrystalMissionKind } from "./types";

export function createCrystalMission(input: {
  id: string;
  communityId: string;
  title: string;
  kind: CrystalMissionKind;
  target: number;
  zencoinPool?: number;
}): CrystalMission {
  if (!input.id.trim()) throw new Error("mission_id_required");
  if (!input.communityId.trim()) throw new Error("communityId_required");
  if (!input.title.trim()) throw new Error("mission_title_required");
  if (input.target < 1) throw new Error("mission_target_invalid");

  return {
    id: input.id,
    communityId: input.communityId,
    title: input.title,
    kind: input.kind,
    target: input.target,
    progress: 0,
    status: "draft",
    participantIds: [],
    zencoinPool: Math.max(0, input.zencoinPool ?? 0),
  };
}

export function activateMission(mission: CrystalMission): CrystalMission {
  return { ...mission, status: "active" };
}

export function completeMission(mission: CrystalMission): CrystalMission {
  return {
    ...mission,
    status: "completed",
    progress: mission.target,
    memoryUnlockId: mission.memoryUnlockId ?? `mission_memory_${mission.id}`,
  };
}
