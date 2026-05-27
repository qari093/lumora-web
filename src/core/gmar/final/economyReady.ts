export function economyReady(balance: number) {
  return {
    healthy: balance > 0
  };
}
