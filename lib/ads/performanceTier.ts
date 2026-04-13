export type PerformanceTierInput = {
  ctr: number;
  conversionRate: number;
  roi: number;
};

export type PerformanceTierResult = {
  ctr: number;
  conversionRate: number;
  roi: number;
  score: number;
  tier: "low" | "medium" | "high" | "elite";
};

export function calculatePerformanceTier(
  input: PerformanceTierInput
): PerformanceTierResult {
  const ctr = Math.max(0, Number(input.ctr ?? 0));
  const conversionRate = Math.max(0, Number(input.conversionRate ?? 0));
  const roi = Number(input.roi ?? 0);

  // Weighted scoring (empirically balanced)
  const scoreRaw = (ctr * 0.4) + (conversionRate * 0.3) + (roi * 0.3);
  const score = Number(Math.max(0, scoreRaw).toFixed(4));

  let tier: PerformanceTierResult["tier"] = "low";

  if (score >= 0.75) tier = "elite";
  else if (score >= 0.5) tier = "high";
  else if (score >= 0.25) tier = "medium";
  else tier = "low";

  return {
    ctr,
    conversionRate,
    roi,
    score,
    tier,
  };
}
