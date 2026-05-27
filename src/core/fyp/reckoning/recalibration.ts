import type {
  AuraRecalibration
} from "./types";

const rankMap: Record<string, number> = {
  wire: 1,
  spark: 2,
  blaze: 3,
  volt: 4,
  singularity: 5
};

export function recalibrateAura(input: {
  creatorId: string;
  previousTier: string;
  nextTier: string;
}): AuraRecalibration {
  const previous =
    rankMap[input.previousTier] ?? 0;

  const next =
    rankMap[input.nextTier] ?? 0;

  return {
    creatorId: input.creatorId,
    previousTier: input.previousTier,
    nextTier: input.nextTier,
    ascended: next > previous,
    phoenixPhase: next < previous
  };
}
