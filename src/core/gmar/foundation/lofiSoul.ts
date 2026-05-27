export const loFiSoulMode = {
  enabled: true,
  watercolorAtmosphere: true,
  lowPolyFriendly: true,
  emotionallyEquivalent: true,
} as const;

export function loFiSoulHealthy(): boolean {
  return loFiSoulMode.enabled && loFiSoulMode.emotionallyEquivalent;
}
