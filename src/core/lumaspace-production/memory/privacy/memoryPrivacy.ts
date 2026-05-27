import type { MemoryRecord } from "../types";

export function canAccessMemory(memory: MemoryRecord, requesterId: string): boolean {
  if (memory.ownerId === requesterId) return true;
  return memory.visibility === "shared";
}
