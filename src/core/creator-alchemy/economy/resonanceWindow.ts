import type { ResonanceWindowDecision } from "./types";

export function decideResonanceWindow(input: {
  resonanceEnergy: number;
  completionRate: number;
  rewatchRate: number;
  saveRate: number;
  safetyPassed: boolean;
}): ResonanceWindowDecision {
  if (!input.safetyPassed) {
    return {
      allowed: false,
      durationHours: 0,
      audienceExpansion: 0,
      reason: "safety_not_passed"
    };
  }

  const quality =
    clamp01(input.completionRate) * 0.35 +
    clamp01(input.rewatchRate) * 0.35 +
    clamp01(input.saveRate) * 0.3;

  if (input.resonanceEnergy < 500 || quality < 0.45) {
    return {
      allowed: false,
      durationHours: 0,
      audienceExpansion: 0,
      reason: "resonance_not_ready"
    };
  }

  return {
    allowed: true,
    durationHours: input.resonanceEnergy >= 2000 && quality >= 0.7 ? 24 : 8,
    audienceExpansion: Math.min(0.18, 0.04 + quality * 0.16),
    reason: "resonance_window_ready"
  };
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
