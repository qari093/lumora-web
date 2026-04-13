export type VersusCardPairingInput = {
  leftEntityId: string;
  rightEntityId: string;
  leftCategory: "movie" | "series" | "music" | "gaming" | "cross-media";
  rightCategory: "movie" | "series" | "music" | "gaming" | "cross-media";
  leftTrendScore: number;
  rightTrendScore: number;
  leftConfidenceScore: number;
  rightConfidenceScore: number;
  culturalSafetyScore: number;
};

export type VersusCardPairingDecision = {
  allowed: boolean;
  reason:
    | "ok"
    | "same_entity"
    | "category_mismatch"
    | "momentum_gap_too_high"
    | "low_confidence"
    | "low_cultural_safety";
  balanceScore: number;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolveVersusCardPairing(
  input: VersusCardPairingInput
): VersusCardPairingDecision {
  if (input.leftEntityId.trim() === input.rightEntityId.trim()) {
    return { allowed: false, reason: "same_entity", balanceScore: 0 };
  }

  if (input.leftCategory !== input.rightCategory) {
    return { allowed: false, reason: "category_mismatch", balanceScore: 0 };
  }

  const momentumGap = Math.abs(input.leftTrendScore - input.rightTrendScore);
  if (momentumGap > 35) {
    return {
      allowed: false,
      reason: "momentum_gap_too_high",
      balanceScore: clampScore(100 - momentumGap),
    };
  }

  const minConfidence = Math.min(input.leftConfidenceScore, input.rightConfidenceScore);
  if (minConfidence < 55) {
    return {
      allowed: false,
      reason: "low_confidence",
      balanceScore: clampScore(minConfidence),
    };
  }

  if (input.culturalSafetyScore < 55) {
    return {
      allowed: false,
      reason: "low_cultural_safety",
      balanceScore: clampScore(input.culturalSafetyScore),
    };
  }

  const balanceScore = clampScore(
    100 -
      momentumGap * 0.8 -
      Math.abs(input.leftConfidenceScore - input.rightConfidenceScore) * 0.4
  );

  return {
    allowed: true,
    reason: "ok",
    balanceScore,
  };
}

export function canCreateVersusCardPair(
  input: VersusCardPairingInput
): boolean {
  return resolveVersusCardPairing(input).allowed;
}
