import type { AtmosphereMode } from "../core/types";
import type { UserAtmosphereProfile } from "../profile/atmosphereProfile";

export type ModeAffinityScore = {
  mode: AtmosphereMode;
  score: number;
};

export function calculateModeAffinity(
  profile: UserAtmosphereProfile
): ModeAffinityScore[] {
  const base: Record<AtmosphereMode, number> = {
    comfort: profile.comfortBias,
    drift: 75,
    chaos: profile.chaosTolerance,
    deep: 55,
    energy: profile.energyTolerance,
    focus: 65,
    wonder: 58
  };

  return Object.entries(base)
    .map(([mode, score]) => ({
      mode: mode as AtmosphereMode,
      score
    }))
    .sort((a, b) => b.score - a.score);
}

export function getTopMode(
  profile: UserAtmosphereProfile
): AtmosphereMode {
  return calculateModeAffinity(profile)[0]?.mode ?? "drift";
}
