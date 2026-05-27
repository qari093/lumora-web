import type { MemoryShelfEntry } from "./memoryEntry";

export function orderMemoriesChronologically(entries: MemoryShelfEntry[]): MemoryShelfEntry[] {
  return [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
