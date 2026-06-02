export type AdaptiveZoneResult = {
  activationZoneScale: number;
  smartExpansionEnabled: boolean;
};

export function computeAdaptiveZone(repeatedAttempts: number): AdaptiveZoneResult {
  return {
    activationZoneScale: Math.min(1.5, 1 + repeatedAttempts * 0.05),
    smartExpansionEnabled: repeatedAttempts >= 3,
  };
}
