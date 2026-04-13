export type TrendDemotionTier =
  | "keep"
  | "soft-demote"
  | "hard-demote"
  | "remove";

export type TrendDemotionInput = {
  confidenceScore: number;
  trendScore: number;
  culturalScore: number;
  rightsScore: number;
  decayScore: number;
};

export function resolveTrendDemotionTier(
  input: TrendDemotionInput
): TrendDemotionTier {
  if (input.rightsScore < 35 || input.culturalScore < 35) {
    return "remove";
  }

  if (input.decayScore < 20 || (input.trendScore < 30 && input.confidenceScore < 30)) {
    return "hard-demote";
  }

  if (input.decayScore < 40 || input.trendScore < 45 || input.confidenceScore < 45) {
    return "soft-demote";
  }

  return "keep";
}

export function shouldDemoteTrend(
  input: TrendDemotionInput
): boolean {
  return resolveTrendDemotionTier(input) !== "keep";
}
