import type { LiveMemoryEntry } from "./storeMemoryEntry";

export function renderMemoriesChronologically(entries: LiveMemoryEntry[]) {
  return [...entries].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
