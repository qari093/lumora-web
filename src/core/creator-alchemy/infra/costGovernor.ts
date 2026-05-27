import type { CostGovernorDecision, CostGovernorInput, InfraTier } from "./types";

export function decideCostGovernor(input: CostGovernorInput): CostGovernorDecision {
  const remaining = Math.max(0, input.dailyBudgetUnits - input.usedUnits);

  if (input.requestedUnits <= remaining) {
    return {
      allowed: true,
      tier: preferredTier(input.feature),
      reason: "within_budget"
    };
  }

  if (input.feature === "mythic") {
    return {
      allowed: false,
      tier: "deferred",
      reason: "mythic_deferred_for_budget"
    };
  }

  if (remaining > 0) {
    return {
      allowed: true,
      tier: "batch",
      reason: "downgraded_to_batch"
    };
  }

  return {
    allowed: false,
    tier: "deferred",
    reason: "budget_exhausted"
  };
}

function preferredTier(feature: CostGovernorInput["feature"]): InfraTier {
  if (feature === "dashboard") return "edge";
  if (feature === "whisper") return "batch";
  if (feature === "constellation") return "worker";
  if (feature === "economy") return "worker";
  return "deferred";
}
