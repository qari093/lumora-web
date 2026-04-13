export type PortalPerformanceInput = {
  ctr: number;
  engagementScore: number;
  conversions?: number;
};

export type PortalPerformanceResult = {
  ctr: number;
  engagementScore: number;
  conversions: number;
  performanceScore: number;
  band: "low" | "medium" | "high";
};

export function calculatePortalPerformance(
  input: PortalPerformanceInput
): PortalPerformanceResult {
  const ctr = Math.max(0, Math.min(1, Number(input.ctr ?? 0)));
  const engagementScore = Math.max(0, Math.min(1, Number(input.engagementScore ?? 0)));
  const conversions = Math.max(0, Math.floor(input.conversions ?? 0));

  const conversionBoost = Math.min(0.2, conversions * 0.02);
  const performanceScore = Number(
    Math.min(1, ctr * 0.45 + engagementScore * 0.45 + conversionBoost).toFixed(4)
  );

  const band =
    performanceScore >= 0.7 ? "high" :
    performanceScore >= 0.35 ? "medium" :
    "low";

  return {
    ctr,
    engagementScore,
    conversions,
    performanceScore,
    band,
  };
}
