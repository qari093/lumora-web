import type { JourneyCapsule, MemoryStar } from "./types";

export function createJourneyCapsule(title: string, memories: MemoryStar[]): JourneyCapsule {
  return {
    id: `journey_capsule_${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    title,
    memories,
    delivery: "now",
  };
}

export function createTimeCapsule(title: string, memories: MemoryStar[], unlockAt: string): JourneyCapsule {
  return {
    id: `time_capsule_${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    title,
    memories,
    delivery: "future",
    unlockAt,
  };
}
