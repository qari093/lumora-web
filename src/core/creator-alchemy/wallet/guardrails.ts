export function validateWalletCopy(copy: string): boolean {
  const lower = copy.toLowerCase();
  const blocked = [
    "gamble",
    "bet",
    "jackpot",
    "guaranteed profit",
    "creator stock",
    "pay to win",
    "buy followers",
    "buy reach"
  ];

  return !blocked.some((term) => lower.includes(term));
}
