import type { LiveMemoryEntry } from "./storeMemoryEntry";

export function syncEntriesIntoMemoryShelf(input: {
  creatorId: string;
  entries: LiveMemoryEntry[];
}) {
  return {
    creatorId: input.creatorId,
    entries: input.entries.filter(e => e.creatorId === input.creatorId && e.stored),
    synced: true,
  };
}
