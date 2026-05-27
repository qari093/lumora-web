import type { EmotionalOverloadInput, EmotionalOverloadResult } from "./types";

export function assessEmotionalOverload(input: EmotionalOverloadInput): EmotionalOverloadResult {
  if (input.creatorDismissals >= 3) {
    return {
      level: "pause",
      suppressInsights: true,
      suppressRituals: true,
      reason: "creator_dismissed_emotional_systems"
    };
  }

  if (input.ritualsShownThisMonth > 2) {
    return {
      level: "reduce",
      suppressInsights: false,
      suppressRituals: true,
      reason: "ritual_density_too_high"
    };
  }

  if (input.insightsShownThisWeek > 3 || input.atmospheresShownThisWeek > 4) {
    return {
      level: "watch",
      suppressInsights: input.insightsShownThisWeek > 3,
      suppressRituals: false,
      reason: "weekly_emotional_density_high"
    };
  }

  return {
    level: "safe",
    suppressInsights: false,
    suppressRituals: false,
    reason: "safe"
  };
}
