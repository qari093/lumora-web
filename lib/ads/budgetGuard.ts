export type BudgetGuardInput = {
  spent: number;
  budget: number;
};

export type BudgetGuardResult = {
  spent: number;
  budget: number;
  remaining: number;
  allowed: boolean;
  utilization: number;
};

export function checkBudgetGuard(input: BudgetGuardInput): BudgetGuardResult {
  const spent = Math.max(0, Number(input.spent ?? 0));
  const budget = Math.max(0, Number(input.budget ?? 0));

  if (budget === 0) {
    return {
      spent,
      budget,
      remaining: 0,
      allowed: false,
      utilization: 1,
    };
  }

  const remaining = Math.max(0, Number((budget - spent).toFixed(4)));
  const utilization = Number(Math.min(1, spent / budget).toFixed(4));

  return {
    spent,
    budget,
    remaining,
    allowed: spent < budget,
    utilization,
  };
}
