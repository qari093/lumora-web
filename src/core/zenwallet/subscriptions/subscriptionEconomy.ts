export type SubscriptionPlan = {
  id: string;
  monthlyAllowance: number;
  priceEUR: number;
};

export const PLANS: Record<string, SubscriptionPlan> = {
  free: { id: "free", monthlyAllowance: 0, priceEUR: 0 },
  plus: { id: "plus", monthlyAllowance: 100, priceEUR: 9.99 },
  creator_pro: { id: "creator_pro", monthlyAllowance: 200, priceEUR: 19.99 },
};

export function calculateRollover(unused: number, monthlyAllowance: number) {
  const rollover = Math.floor(unused * 0.2);
  return Math.min(rollover, monthlyAllowance * 2);
}

export function calculateDowngradeGraceExcess(currentRollover: number, newMonthlyAllowance: number) {
  const cap = newMonthlyAllowance * 2;
  return {
    retained: Math.min(currentRollover, cap),
    excess: Math.max(0, currentRollover - cap),
    graceDays: currentRollover > cap ? 30 : 0,
  };
}

export function isPayToWinAllowed() {
  return false;
}
