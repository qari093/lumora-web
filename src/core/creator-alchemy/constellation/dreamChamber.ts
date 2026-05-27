import type { BridgeEvent, ConstellationId, DreamChamberState } from "./types";

export function buildDreamChamberState(input: {
  triggerStrength: number;
  daysUntilEvent: number | null;
  activeNow: boolean;
}): DreamChamberState {
  const strongEnough = Number.isFinite(input.triggerStrength) && input.triggerStrength >= 0.72;

  return {
    active: strongEnough && input.activeNow,
    preGlow: strongEnough && typeof input.daysUntilEvent === "number" && input.daysUntilEvent <= 3 && input.daysUntilEvent > 0,
    likesHidden: true,
    commentsHidden: true,
    presenceOnly: true
  };
}

export function createBridgeOfTwoWorlds(from: ConstellationId, to: ConstellationId, active: boolean): BridgeEvent {
  return {
    active,
    from,
    to,
    anonymous: true,
    labelHidden: true
  };
}
