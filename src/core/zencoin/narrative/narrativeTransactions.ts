export const narrativeTransactions = {
  narrativeView: true,
  plainFinancialView: true,
  transparencyProtected: true
} as const;

export function narrativeMessage(): string {
  return "You unlocked Rainy Night Tokyo — 50 ZC spent.";
}

export function narrativeHealthy(): boolean {
  return (
    narrativeTransactions.narrativeView &&
    narrativeTransactions.plainFinancialView &&
    narrativeTransactions.transparencyProtected
  );
}
