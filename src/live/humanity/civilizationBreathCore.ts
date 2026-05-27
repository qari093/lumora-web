export type CivilizationBreathState = {
  shouldOpenStillPoint: boolean;
  reason: "balance_unrestored" | "none";
};

export function evaluateCivilizationBreath(daysImbalanced: number, restorationActive: boolean): CivilizationBreathState {
  if (daysImbalanced >= 3 && !restorationActive) {
    return { shouldOpenStillPoint: true, reason: "balance_unrestored" };
  }

  return { shouldOpenStillPoint: false, reason: "none" };
}
