import type { MemoryConstellation, MemoryNode } from "./types";

export function createMemoryConstellation(input: {
  id: string;
  memories: MemoryNode[];
  durationDays?: number;
}): MemoryConstellation {
  if (!input.id.trim()) throw new Error("constellation_id_required");
  if (input.memories.length < 2) throw new Error("at_least_two_memories_required");

  const participantIds = Array.from(new Set(input.memories.flatMap((memory) => memory.participantIds)));
  const sourceMemoryIds = input.memories.map((memory) => memory.id);

  return {
    id: input.id,
    participantIds,
    sourceMemoryIds,
    expiresAt: Date.now() + (input.durationDays ?? 7) * 24 * 60 * 60 * 1000,
    syncEnabled: true,
    echoIds: [],
  };
}

export function addConstellationEcho(
  constellation: MemoryConstellation,
  echoId: string,
): MemoryConstellation {
  if (!echoId.trim()) throw new Error("echoId_required");

  return {
    ...constellation,
    echoIds: Array.from(new Set([...constellation.echoIds, echoId])),
  };
}

export function isConstellationActive(constellation: MemoryConstellation, now = Date.now()): boolean {
  return constellation.expiresAt > now;
}
