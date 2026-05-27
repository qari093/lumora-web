export const calmSpending = {
  optionalCaps: true,
  cooldowns: true,
  humaneNudges: true,
  antiAddiction: true
} as const;

export function cooldownRequired(amount: number): boolean {
  return amount >= 20;
}

export function calmSpendingHealthy(): boolean {
  return (
    calmSpending.optionalCaps &&
    calmSpending.cooldowns &&
    calmSpending.humaneNudges &&
    calmSpending.antiAddiction
  );
}
