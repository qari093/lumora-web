import type {
  ReckoningDay
} from "./types";

export function createReckoningDay(input: {
  year: number;
  creatorCount: number;
}): ReckoningDay {
  return {
    reckoningId: `reckoning_${input.year}`,
    year: input.year,
    state: "scheduled",
    creatorCount: input.creatorCount
  };
}

export function activateReckoningDay(
  reckoning: ReckoningDay
): ReckoningDay {
  return {
    ...reckoning,
    state: "active"
  };
}
