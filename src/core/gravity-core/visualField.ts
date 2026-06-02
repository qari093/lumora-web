import type { GravityIntentResult } from "./types";

export type GravityVisualField = {
  vignetteIntensity: number;
  wellOpacity: number;
  ringOpacity: number;
  ringScale: number;
  ringVisible: boolean;
  labelVisible: boolean;
};

function clamp(value: number, min = 0, max = 1): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export function computeGravityVisualField(result: GravityIntentResult): GravityVisualField {
  const intent = clamp(result.intentScore);
  const proximity = clamp(result.proximity);
  const confidence = clamp(result.confidence);

  const ringVisible = result.shouldShowRing;
  const ringOpacity = ringVisible ? clamp(0.18 + confidence * 0.62) : 0;
  const ringScale = ringVisible ? clamp(0.82 + confidence * 0.28, 0.82, 1.1) : 0.78;

  return {
    vignetteIntensity: clamp(proximity * 0.22 + intent * 0.24, 0, 0.42),
    wellOpacity: clamp(proximity * 0.18 + intent * 0.18, 0, 0.34),
    ringOpacity,
    ringScale,
    ringVisible,
    labelVisible: ringVisible && confidence >= 0.58,
  };
}
