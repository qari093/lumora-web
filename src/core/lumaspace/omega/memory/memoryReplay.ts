import type { MemoryConstellation, MemoryNode } from "./types";

export type MemoryReplay = {
  id: string;
  mode: "single" | "shared_constellation";
  memoryIds: string[];
  participantIds: string[];
  durationSeconds: number;
  caption: string;
};

export function createMemoryReplay(memory: MemoryNode): MemoryReplay {
  return {
    id: `replay_${memory.id}`,
    mode: "single",
    memoryIds: [memory.id],
    participantIds: memory.participantIds,
    durationSeconds: Math.max(5, Math.min(30, Math.round(memory.emotionalWeight / 4))),
    caption: memory.summary,
  };
}

export function createSharedReliveReplay(constellation: MemoryConstellation): MemoryReplay {
  return {
    id: `relive_${constellation.id}`,
    mode: "shared_constellation",
    memoryIds: constellation.sourceMemoryIds,
    participantIds: constellation.participantIds,
    durationSeconds: Math.max(10, Math.min(45, constellation.sourceMemoryIds.length * 8)),
    caption: "A shared moment is glowing again.",
  };
}
