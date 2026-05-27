export function shouldEmitRuntimeSilentPulse(input: {
  enabled: boolean;
  daysSinceLastPulse: number;
  activeCreatorsInConstellation: number;
  userDismissedPulse: boolean;
}): boolean {
  if (!input.enabled) return false;
  if (input.userDismissedPulse) return false;
  if (input.daysSinceLastPulse < 21) return false;
  return input.activeCreatorsInConstellation >= 3;
}
