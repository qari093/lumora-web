import type { RuntimeConstellation, RuntimeConstellationState, RuntimeCreatorSignal } from "./types";

export function inferRuntimeConstellation(signal: RuntimeCreatorSignal): RuntimeConstellationState {
  const constellation: RuntimeConstellation =
    signal.rewatchDensity >= 0.6
      ? "Midnight Souls"
      : signal.creatorCuriosity >= 0.55
        ? "Neon Dreamers"
        : signal.toneShift >= 0.5
          ? "Restless Voices"
          : "Slow Fire";

  const driftExposure = calculateRuntimeDriftExposure(signal);

  return {
    creatorId: signal.creatorId,
    constellation,
    confidence: Math.min(0.95, 0.5 + signal.rewatchDensity * 0.25 + signal.creatorCuriosity * 0.2),
    driftExposure,
    shadowEligible: signal.rewatchDensity >= 0.35 || signal.creatorCuriosity >= 0.35
  };
}

export function calculateRuntimeDriftExposure(signal: RuntimeCreatorSignal): number {
  const score = signal.toneShift * 0.38 + signal.audienceMutation * 0.37 + signal.creatorCuriosity * 0.25;
  if (score >= 0.52) return Math.min(0.3, 0.08 + score * 0.35);
  return 0.05;
}
