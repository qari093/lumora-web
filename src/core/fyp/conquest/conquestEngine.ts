import type {
  AtmosphereConquest
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createAtmosphereConquest(input: {
  mode: AtmosphereMode;
  creatorIds: string[];
  startsAt: number;
  endsAt: number;
}): AtmosphereConquest {
  if (input.creatorIds.length < 2) {
    throw new Error("Conquest requires at least 2 creators.");
  }

  return {
    conquestId: `conquest_${input.mode}_${input.startsAt}`,
    mode: input.mode,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    active: true,
    creatorIds: input.creatorIds
  };
}
