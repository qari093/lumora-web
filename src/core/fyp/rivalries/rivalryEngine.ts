import type {
  VoltRivalry
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createVoltRivalry(input: {
  mode: AtmosphereMode;
  creatorA: string;
  creatorB: string;
}): VoltRivalry {
  if (input.creatorA === input.creatorB) {
    throw new Error("Volt Rivalry requires 2 distinct creators.");
  }

  return {
    rivalryId: `rivalry_${input.mode}_${Date.now()}`,
    mode: input.mode,
    creatorA: input.creatorA,
    creatorB: input.creatorB,
    accepted: true,
    active: true
  };
}
