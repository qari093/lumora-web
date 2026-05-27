export type ResonanceCluster = "calm" | "adrenaline" | "strategy" | "social";

export type ResonanceCompassResult = {
  cluster: ResonanceCluster;
  confidence: number;
  serverSafePayload: {
    cluster: ResonanceCluster;
    consent: boolean;
  };
};

export function completeResonanceCompass(choice: ResonanceCluster, consent = true): ResonanceCompassResult {
  return {
    cluster: choice,
    confidence: 0.74,
    serverSafePayload: {
      cluster: choice,
      consent,
    },
  };
}
