export type FatigueGateInput = {
  adId: string;
  fatigueScore: number;
  threshold?: number;
};

export type FatigueGateResult = {
  adId: string;
  fatigueScore: number;
  threshold: number;
  allowed: boolean;
  reason: "within_fatigue_limit" | "fatigue_blocked";
};

export function evaluateFatigueGate(
  input: FatigueGateInput
): FatigueGateResult {
  const adId = String(input.adId || "");
  const fatigueScore = Math.max(0, Math.min(1, Number(input.fatigueScore ?? 0)));
  const threshold = Math.max(0, Math.min(1, Number(input.threshold ?? 0.45)));

  if (fatigueScore >= threshold) {
    return {
      adId,
      fatigueScore,
      threshold,
      allowed: false,
      reason: "fatigue_blocked",
    };
  }

  return {
    adId,
    fatigueScore,
    threshold,
    allowed: true,
    reason: "within_fatigue_limit",
  };
}
