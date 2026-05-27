import type { ProductionSavedMoment } from "./types";

export function saveProductionMoment(input: Omit<ProductionSavedMoment, "id" | "createdAt">): ProductionSavedMoment {
  return {
    ...input,
    id: `moment-${input.userId}-${input.creatorId}-${input.timestampMs}`,
    createdAt: new Date().toISOString(),
  };
}
