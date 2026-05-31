import type { SpaceSphereState } from "./types";

const AURA_BY_MOOD: Record<SpaceSphereState["mood"], string> = {
  calm: "blue_gold",
  creative: "violet_amber",
  focused: "silver_blue",
  healing: "green_pearl",
  builder: "gold_copper",
};

export function createSpaceSphereState(input: {
  citizenId: string;
  mood: SpaceSphereState["mood"];
  contributionScore?: number;
  reducedMotion?: boolean;
}): SpaceSphereState {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");

  const contributionScore = Math.max(0, input.contributionScore ?? 0);
  const reducedMotion = input.reducedMotion === true;

  return {
    citizenId: input.citizenId,
    mood: input.mood,
    aura: AURA_BY_MOOD[input.mood],
    glow: Math.min(100, 20 + contributionScore),
    rotationSpeed: reducedMotion ? 0 : Math.max(0.15, 1 - contributionScore / 300),
    reducedMotion,
  };
}

export function updateSpaceSphereMood(
  state: SpaceSphereState,
  mood: SpaceSphereState["mood"],
): SpaceSphereState {
  return {
    ...state,
    mood,
    aura: AURA_BY_MOOD[mood],
  };
}
