import type { MemoryIndexEntry, MemoryRecord } from "../types";

export function indexMemory(memory: MemoryRecord): MemoryIndexEntry {
  return {
    id: `idx_${memory.id}`,
    memoryId: memory.id,
    tags: [memory.atmosphere, memory.visibility]
  };
}
