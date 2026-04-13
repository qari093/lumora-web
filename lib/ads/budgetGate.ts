export type BudgetGateInput = {
  adId: string;
  spent: number;
  budget: number;
};

export type BudgetGateResult = {
  adId: string;
  allowed: boolean;
  remaining: number;
  reason: "within_budget" | "budget_exhausted";
};

export function evaluateBudgetGate(input: BudgetGateInput): BudgetGateResult {
  const adId = String(input.adId || "");
  const spent = Math.max(0, Number(input.spent ?? 0));
  const budget = Math.max(0, Number(input.budget ?? 0));
  const remaining = Math.max(0, Number((budget - spent).toFixed(4)));

  if (spent < budget) {
    return {
      adId,
      allowed: true,
      remaining,
      reason: "within_budget",
    };
  }

  return {
    adId,
    allowed: false,
    remaining: 0,
    reason: "budget_exhausted",
  };
}
