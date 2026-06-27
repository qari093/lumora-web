export interface FypCostGuardInput {
  estimatedMonthlyEgressUsd: number;
  monthlyBudgetUsd: number;
  estimatedCostPerBetaUserUsd: number;
}

export interface FypCostGuardResult {
  ok: boolean;
  warnings: string[];
}

export function evaluateFypCostGuard(
  input: FypCostGuardInput
): FypCostGuardResult {
  const warnings: string[] = [];

  if (input.estimatedMonthlyEgressUsd > input.monthlyBudgetUsd) {
    warnings.push("monthly_egress_budget_exceeded");
  }

  if (input.estimatedCostPerBetaUserUsd > 0.3) {
    warnings.push("cost_per_beta_user_above_target");
  }

  return {
    ok: warnings.length === 0,
    warnings
  };
}
