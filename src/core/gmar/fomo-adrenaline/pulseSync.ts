export type PulseSyncInput = {
  meanCorrelation: number;
  smoothMovementScore: number;
  consecutiveSeconds: number;
};

export type PulseSyncState = {
  active: boolean;
  hudStripped: boolean;
  heartbeatAudio: boolean;
  grantsPower: false;
};

export function detectPulseSync(input: PulseSyncInput): PulseSyncState {
  const active =
    input.meanCorrelation >= 0.7 &&
    input.smoothMovementScore >= 0.65 &&
    input.consecutiveSeconds >= 8;

  return {
    active,
    hudStripped: active,
    heartbeatAudio: active,
    grantsPower: false,
  };
}
