export function evaluateBudget(input: {
  total: number;
  spent: number;
  daily: number;
  spentToday: number;
}) {
  return {
    canSpend:
      input.total - input.spent > 0 &&
      input.daily - input.spentToday > 0,
  };
}
