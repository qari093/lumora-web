export const nexaFeatureFlags = {
  bodyWeather: true,
  echoOrb: true,
  lumenAi: true,
  dailyMovementSculpture: true,
  nutritionEngine: true,
  recoveryEngine: true,
  sanctuaries: true,
  zencoinBridge: true,
  reducedMotion: true,
  neurodivergentMode: true
} as const;

export function flagsHealthy(): boolean {
  return Object.values(nexaFeatureFlags).every(Boolean);
}
