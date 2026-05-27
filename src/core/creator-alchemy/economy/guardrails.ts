const BLOCKED_ECONOMY_TERMS = [
  "bet",
  "casino",
  "jackpot",
  "creator stock",
  "speculate",
  "guaranteed profit",
  "pay to win",
  "buy reach"
];

export function validateEconomyCopy(copy: string): boolean {
  const lower = copy.toLowerCase();
  return !BLOCKED_ECONOMY_TERMS.some((term) => lower.includes(term));
}

export function validatePayoutSplit(input: { creatorShare: number; platformShare: number }): boolean {
  const total = input.creatorShare + input.platformShare;
  return Math.abs(total - 1) < 0.0001 && input.creatorShare >= 0.6 && input.platformShare <= 0.4;
}
