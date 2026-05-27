export type AdrenalineLimiterState = {
  overloadRisk: boolean;
  maxPulseMinutes: number;
  cooldownRequired: boolean;
};

export function calculateAdrenalineLimiter(input: {
  recentPulseMinutes: number;
  averageIntensity: number;
}): AdrenalineLimiterState {
  const overloadRisk =
    input.recentPulseMinutes >= 20 ||
    input.averageIntensity >= 8.5;

  return {
    overloadRisk,
    maxPulseMinutes: overloadRisk ? 5 : 15,
    cooldownRequired: overloadRisk
  };
}
