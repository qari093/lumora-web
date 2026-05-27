import type {
  PersonalizationDecision,
  PersonalizationProfile
} from "../types";

export function personalizeScore(
  profile: PersonalizationProfile,
  itemId: string,
  baseScore: number
): PersonalizationDecision {
  const affinityBoost = profile.affinity[itemId] ?? 0;

  const personalizedScore = Math.max(
    0,
    Math.min(100, baseScore + affinityBoost)
  );

  return {
    itemId,
    baseScore,
    personalizedScore,
    reason:
      affinityBoost > 0
        ? "positive_affinity"
        : "neutral_affinity"
  };
}
