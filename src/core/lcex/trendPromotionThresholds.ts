export type TrendPromotionTier =
  | "hold"
  | "surface"
  | "promote"
  | "premium-promote";

export type TrendPromotionInput = {
  confidenceScore: number;
  trendScore: number;
  culturalScore: number;
  rightsScore: number;
};

export function resolveTrendPromotionTier(
  input: TrendPromotionInput
): TrendPromotionTier {
  const minimumSafe =
    input.culturalScore >= 55 && input.rightsScore >= 55;

  if (!minimumSafe) return "hold";

  if (input.trendScore >= 85 && input.confidenceScore >= 80) {
    return "premium-promote";
  }

  if (input.trendScore >= 72 && input.confidenceScore >= 68) {
    return "promote";
  }

  if (input.trendScore >= 58 && input.confidenceScore >= 55) {
    return "surface";
  }

  return "hold";
}

export function canPromoteTrend(
  input: TrendPromotionInput
): boolean {
  const tier = resolveTrendPromotionTier(input);
  return tier === "promote" || tier === "premium-promote";
}
