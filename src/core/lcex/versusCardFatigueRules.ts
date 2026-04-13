export type VersusCardFatigueInput = {
  impressionsLast24h: number;
  votesLast24h: number;
  dismissalsLast24h: number;
  hidesLast24h: number;
  repeatExposureRate: number;
};

export type VersusCardFatigueDecision = {
  fatigued: boolean;
  fatigueScore: number;
  tier: "none" | "watch" | "high" | "critical";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolveVersusCardFatigue(
  input: VersusCardFatigueInput
): VersusCardFatigueDecision {
  const participationResistance =
    input.impressionsLast24h <= 0
      ? 0
      : Math.max(0, 100 - (input.votesLast24h / input.impressionsLast24h) * 100);

  const fatigueScore = clampScore(
    participationResistance * 0.4 +
      Math.min(input.dismissalsLast24h * 4, 100) * 0.2 +
      Math.min(input.hidesLast24h * 5, 100) * 0.2 +
      input.repeatExposureRate * 0.2
  );

  return {
    fatigued: fatigueScore >= 55,
    fatigueScore,
    tier:
      fatigueScore >= 85
        ? "critical"
        : fatigueScore >= 70
        ? "high"
        : fatigueScore >= 55
        ? "watch"
        : "none",
  };
}

export function shouldThrottleVersusCard(
  input: VersusCardFatigueInput
): boolean {
  return resolveVersusCardFatigue(input).fatigued;
}
