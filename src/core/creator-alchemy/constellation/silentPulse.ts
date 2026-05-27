export function shouldSendSilentPulse(input: {
  enabled: boolean;
  daysSinceLastPulse: number;
  constellationActivity: number;
}): boolean {
  if (!input.enabled) return false;
  if (input.daysSinceLastPulse < 21) return false;
  return input.constellationActivity >= 0.55;
}
