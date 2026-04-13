export type CultureAwareSpreadMode =
  | "full"
  | "limited"
  | "region-locked"
  | "manual-review"
  | "blocked";

export type CultureAwareSpreadInput = {
  culturalScore: number;
  sensitivityScore: number;
  satireAmbiguityScore: number;
  rightsScore: number;
};

export type CultureAwareSpreadDecision = {
  mode: CultureAwareSpreadMode;
  maxRegions: number;
  reason: string;
};

export function resolveCultureAwareSpreadControl(
  input: CultureAwareSpreadInput
): CultureAwareSpreadDecision {
  if (input.rightsScore < 35) {
    return {
      mode: "blocked",
      maxRegions: 0,
      reason: "Rights score too low for spread.",
    };
  }

  if (input.culturalScore < 35 || input.sensitivityScore >= 85) {
    return {
      mode: "manual-review",
      maxRegions: 0,
      reason: "High cultural or sensitivity risk requires review.",
    };
  }

  if (input.satireAmbiguityScore >= 80) {
    return {
      mode: "region-locked",
      maxRegions: 1,
      reason: "High satire ambiguity limits spread to a locked region.",
    };
  }

  if (input.culturalScore < 60 || input.sensitivityScore >= 60) {
    return {
      mode: "limited",
      maxRegions: 3,
      reason: "Moderate cultural risk requires controlled spread.",
    };
  }

  return {
    mode: "full",
    maxRegions: 999,
    reason: "Content is eligible for normal spread.",
  };
}

export function canSpreadBeyondOriginRegion(
  input: CultureAwareSpreadInput
): boolean {
  const decision = resolveCultureAwareSpreadControl(input);
  return decision.mode === "full" || decision.mode === "limited";
}
