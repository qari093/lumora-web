import type { SavedMomentRuntime } from "./types";

export function createSavedMoment(input: Omit<SavedMomentRuntime, "id" | "createdAt">): SavedMomentRuntime {
  return {
    ...input,
    id: `moment-${input.userId}-${input.sourceId}-${input.timestampMs}`,
    createdAt: new Date().toISOString(),
  };
}
