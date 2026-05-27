import type {
  AuraRecalibration,
  PhoenixPhase
} from "./types";

export function createPhoenixPhase(
  recalibration: AuraRecalibration
): PhoenixPhase {
  if (!recalibration.phoenixPhase) {
    throw new Error("Phoenix Phase requires downward recalibration.");
  }

  return {
    creatorId: recalibration.creatorId,
    title: "Phoenix Rising",
    discoveryBoostPercent: 25,
    durationDays: 30,
    active: true
  };
}
