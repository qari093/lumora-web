import type { LiveMemoryEntry } from "./storeMemoryEntry";

export function validateMemoryIntegrity(entry: LiveMemoryEntry) {
  const ok =
    !!entry.id &&
    !!entry.creatorId &&
    !!entry.circleId &&
    !!entry.videoId &&
    typeof entry.timestampMs === "number" &&
    !!entry.phrase &&
    entry.stored === true;

  return { ok };
}
