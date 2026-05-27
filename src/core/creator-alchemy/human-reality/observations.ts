import type { HumanRealityObservation } from "./types";

export function normalizeHumanRealityObservation(input: HumanRealityObservation): HumanRealityObservation {
  return {
    ...input,
    daysActive: Math.max(0, input.daysActive),
    trustScore: Math.max(0, Math.min(1, input.trustScore))
  };
}
