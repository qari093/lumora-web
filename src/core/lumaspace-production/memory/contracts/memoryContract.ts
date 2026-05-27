import type { MemoryRecord, MemoryIndexEntry, MemoryRuntime } from "../types";

export function validateMemoryRecord(memory: MemoryRecord): boolean {
  return Boolean(memory.id && memory.ownerId && memory.atmosphere && memory.visibility && Number.isFinite(memory.createdAt));
}

export function validateMemoryIndexEntry(entry: MemoryIndexEntry): boolean {
  return Boolean(entry.id && entry.memoryId && Array.isArray(entry.tags));
}

export function validateMemoryRuntime(runtime: MemoryRuntime): boolean {
  return Boolean(runtime.active === true && runtime.memories.every(validateMemoryRecord));
}
