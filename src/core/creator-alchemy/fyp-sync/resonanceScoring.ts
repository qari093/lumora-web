import type { FypCreatorSignal, FypSyncScore } from "./types";

export function scoreFypCreatorResonance(signal: FypCreatorSignal): FypSyncScore {
  const resonanceScore =
    clamp01(signal.rewatchRate) * 0.34 +
    clamp01(signal.saveRate) * 0.28 +
    clamp01(signal.completionRate) * 0.28 +
    clamp01(signal.originality) * 0.1;

  const suppressForBurnout = signal.burnoutRisk >= 0.72;

  return {
    creatorId: signal.creatorId,
    contentId: signal.contentId,
    resonanceScore,
    feedBoost: suppressForBurnout ? 0 : Math.min(0.2, resonanceScore * 0.18),
    suppressForBurnout,
    constellationDiscovery: resonanceScore >= 0.58 && !suppressForBurnout
  };
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
