import type { SharedWorld } from "./types";

export function addSharedWorldMemory(world: SharedWorld, memoryId: string): SharedWorld {
  if (!memoryId.trim()) throw new Error("memoryId_required");

  return {
    ...world,
    memoryIds: Array.from(new Set([...world.memoryIds, memoryId])),
  };
}

export function addSharedWorldBloom(world: SharedWorld, bloomId: string): SharedWorld {
  if (!bloomId.trim()) throw new Error("bloomId_required");

  return {
    ...world,
    treeBloomIds: Array.from(new Set([...world.treeBloomIds, bloomId])),
  };
}
