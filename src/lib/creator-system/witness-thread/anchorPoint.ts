import type { WitnessThreadPoint } from "./threadLine";

export function createFirstWitnessAnchorPoint(input: {
  creatorId: string;
  witnessId: string;
  circleId: string;
  createdAt?: string;
}): WitnessThreadPoint {
  return {
    id: `anchor-${input.creatorId}-${input.witnessId}-${input.circleId}`,
    creatorId: input.creatorId,
    witnessId: input.witnessId,
    circleId: input.circleId,
    createdAt: input.createdAt || new Date().toISOString(),
    label: "first quiet presence",
  };
}
