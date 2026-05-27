export function calculateDailyBaseIssuance(input: {
  dayIndex: number;
  initialIssuance?: number;
}) {
  const initial = input.initialIssuance ?? 1000;
  const decay = Math.min(0.75, Math.pow(input.dayIndex / 3650, 2));

  return Math.max(0, Math.round(initial * (1 - decay)));
}

export function calculateCounterCyclicalBonus(input: {
  revenuePerUser: number;
  targetRevenuePerUser: number;
  reserveAvailable: number;
}) {
  if (input.revenuePerUser >= input.targetRevenuePerUser) return 0;
  if (input.reserveAvailable <= 0) return 0;

  const gap = input.targetRevenuePerUser - input.revenuePerUser;
  return Math.min(input.reserveAvailable, Math.round(gap * 100));
}
