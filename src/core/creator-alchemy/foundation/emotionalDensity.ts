import type { EmotionalDensityInput, EmotionalDensityResult } from "./types";

export function validateEmotionalDensity(input: EmotionalDensityInput): EmotionalDensityResult {
  const maxInsights = input.creativeIntensity ? 3 : 1;

  if (input.majorInsights > maxInsights) {
    return {
      ok: false,
      maxInsights,
      reason: "too_many_major_insights"
    };
  }

  if (input.atmospheres > 1) {
    return {
      ok: false,
      maxInsights,
      reason: "too_many_atmospheres"
    };
  }

  if (input.symbolicMoments > 1) {
    return {
      ok: false,
      maxInsights,
      reason: "too_many_symbolic_moments"
    };
  }

  return {
    ok: true,
    maxInsights,
    reason: "density_safe"
  };
}
