export type FinalAdEligibilityInput = {
  adId: string;
  spent: number;
  budget: number;
  fatigueScore: number;
  threshold: number;
  seenCount: number;
  maxPerSession: number;
};

export type FinalAdEligibilityResult = {
  adId: string;
  eligible: boolean;
  reasons: string[];
};

export function evaluateFinalAdEligibility(
  input: FinalAdEligibilityInput
): FinalAdEligibilityResult {
  const reasons: string[] = [];

  const spent = Math.max(0, Number(input.spent ?? 0));
  const budget = Math.max(0, Number(input.budget ?? 0));
  const fatigueScore = Math.max(0, Math.min(1, Number(input.fatigueScore ?? 0)));
  const threshold = Math.max(0, Math.min(1, Number(input.threshold ?? 0.45)));
  const seenCount = Math.max(0, Math.floor(input.seenCount ?? 0));
  const maxPerSession = Math.max(1, Math.floor(input.maxPerSession ?? 3));

  if (!(budget > 0 && spent < budget)) {
    reasons.push("budget_blocked");
  }

  if (!(fatigueScore < threshold)) {
    reasons.push("fatigue_blocked");
  }

  if (!(seenCount < maxPerSession)) {
    reasons.push("frequency_blocked");
  }

  return {
    adId: String(input.adId || ""),
    eligible: reasons.length === 0,
    reasons,
  };
}
