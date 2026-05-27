import type { UserAtmosphereProfile } from "../profile/atmosphereProfile";

export type MicroFeedback =
  | "stay_here"
  | "push_harder"
  | "lower_energy"
  | "too_chaotic"
  | "unexpectedly_good";

export function applyMicroFeedback(
  profile: UserAtmosphereProfile,
  feedback: MicroFeedback
): UserAtmosphereProfile {
  if (feedback === "push_harder") {
    return {
      ...profile,
      energyTolerance: Math.min(100, profile.energyTolerance + 10),
      chaosTolerance: Math.min(100, profile.chaosTolerance + 8),
      updatedAt: Date.now()
    };
  }

  if (feedback === "lower_energy" || feedback === "too_chaotic") {
    return {
      ...profile,
      energyTolerance: Math.max(0, profile.energyTolerance - 10),
      chaosTolerance: Math.max(0, profile.chaosTolerance - 10),
      comfortBias: Math.min(100, profile.comfortBias + 8),
      updatedAt: Date.now()
    };
  }

  if (feedback === "stay_here" || feedback === "unexpectedly_good") {
    return {
      ...profile,
      comfortBias: Math.min(100, profile.comfortBias + 3),
      updatedAt: Date.now()
    };
  }

  return profile;
}
