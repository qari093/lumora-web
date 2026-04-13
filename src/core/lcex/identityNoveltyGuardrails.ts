export type IdentityNoveltyGuardrailsInput = {
  noveltyRatio: number;
  fatigueScore: number;
  skipRate: number;
  saveRate: number;
  recentNovelExposures: number;
};

export type IdentityNoveltyGuardrailsDecision = {
  allowedNoveltyRatio: number;
  throttleNovelty: boolean;
  reason:
    | "ok"
    | "high_fatigue"
    | "high_skip_rate"
    | "low_save_rate"
    | "novelty_exposure_limit";
};

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolveIdentityNoveltyGuardrails(
  input: IdentityNoveltyGuardrailsInput
): IdentityNoveltyGuardrailsDecision {
  if (input.fatigueScore >= 75) {
    return {
      allowedNoveltyRatio: 5,
      throttleNovelty: true,
      reason: "high_fatigue",
    };
  }

  if (input.skipRate >= 70) {
    return {
      allowedNoveltyRatio: 10,
      throttleNovelty: true,
      reason: "high_skip_rate",
    };
  }

  if (input.saveRate <= 5) {
    return {
      allowedNoveltyRatio: 12,
      throttleNovelty: true,
      reason: "low_save_rate",
    };
  }

  if (input.recentNovelExposures >= 12) {
    return {
      allowedNoveltyRatio: 15,
      throttleNovelty: true,
      reason: "novelty_exposure_limit",
    };
  }

  return {
    allowedNoveltyRatio: clampPercent(input.noveltyRatio),
    throttleNovelty: false,
    reason: "ok",
  };
}

export function shouldThrottleIdentityNovelty(
  input: IdentityNoveltyGuardrailsInput
): boolean {
  return resolveIdentityNoveltyGuardrails(input).throttleNovelty;
}
