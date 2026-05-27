import type { FirstLightDecision, FirstLightInput } from "./types";

export function decideFirstLight(input: FirstLightInput): FirstLightDecision {
  if (!input.safetyPassed) {
    return {
      eligible: false,
      path: null,
      reward: "none",
      reason: "safety_not_passed"
    };
  }

  if (input.influencedConstellations >= 5 && input.influencedCreators >= 10) {
    return {
      eligible: true,
      path: "community_influence",
      reward: "symbolic_prestige",
      reason: "cross_constellation_influence"
    };
  }

  if (input.structuralNoveltyMonths >= 6) {
    return {
      eligible: true,
      path: "structural_originality",
      reward: "symbolic_prestige",
      reason: "sustained_original_structure"
    };
  }

  return {
    eligible: false,
    path: null,
    reward: "none",
    reason: "originality_not_mature"
  };
}
