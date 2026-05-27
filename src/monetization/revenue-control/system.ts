import { calculateRevenuePerUser } from "./rpu";
import { compareRevenueTarget } from "./comparator";
import { computeRevenueAdjustment } from "./adjustment";
import { enforceRevenueGuardrails } from "./guardrails";

export function evaluateRevenueControl(input: {
  totalRevenue: number;
  activeUsers: number;
  targetRPU: number;
  adsPerSession: number;
  maxAdsPerSession: number;
  userState: "green" | "yellow" | "red";
}) {
  const rpu = calculateRevenuePerUser({
    totalRevenue: input.totalRevenue,
    activeUsers: input.activeUsers,
  });

  const comparison = compareRevenueTarget({
    actualRPU: rpu,
    targetRPU: input.targetRPU,
  });

  const adjustment = computeRevenueAdjustment({
    gap: comparison.gap,
    userState: input.userState,
  });

  const guardrails = enforceRevenueGuardrails({
    adsPerSession: input.adsPerSession,
    maxAdsPerSession: input.maxAdsPerSession,
    userState: input.userState,
  });

  return {
    ok: typeof rpu === "number",
    rpu,
    comparison,
    adjustment,
    guardrails,
  };
}
