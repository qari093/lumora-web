export function economyBalance(income: number, spend: number) {
  return {
    healthy: income >= spend
  };
}
