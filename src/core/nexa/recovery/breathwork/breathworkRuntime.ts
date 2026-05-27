export const breathworkRuntime = {
  boxBreathing: true,
  coherentBreathing: true,
  cyclicSigh: true,
  physiologicalSigh: true,
  breathingRing: true,
  echoAudioSync: true
} as const;

export function breathworkRuntimeHealthy(): boolean {
  return Object.values(breathworkRuntime).every(Boolean);
}
