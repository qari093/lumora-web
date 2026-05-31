import type { CommunityCivilization } from "./types";

export function addCommunityMemory(
  community: CommunityCivilization,
  memoryId: string,
): CommunityCivilization {
  if (!memoryId.trim()) throw new Error("memoryId_required");

  return {
    ...community,
    vaultMemoryIds: Array.from(new Set([...community.vaultMemoryIds, memoryId])),
  };
}

export function addCommunityTreeBloom(
  community: CommunityCivilization,
  bloomId: string,
): CommunityCivilization {
  if (!bloomId.trim()) throw new Error("bloomId_required");

  return {
    ...community,
    treeBloomIds: Array.from(new Set([...community.treeBloomIds, bloomId])),
  };
}

export function attachCommunityMission(
  community: CommunityCivilization,
  missionId: string,
): CommunityCivilization {
  if (!missionId.trim()) throw new Error("missionId_required");

  return {
    ...community,
    activeMissionIds: Array.from(new Set([...community.activeMissionIds, missionId])),
  };
}
