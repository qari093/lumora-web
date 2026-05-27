import type { AtmosphereMode } from "../core/types";
import type { UserAtmosphereProfile } from "../profile/atmosphereProfile";

export function switchMode(
  profile: UserAtmosphereProfile,
  mode: AtmosphereMode
): UserAtmosphereProfile {
  return {
    ...profile,
    currentMode: mode,
    preferredModes: Array.from(
      new Set([mode, ...profile.preferredModes])
    ).slice(0, 5),
    updatedAt: Date.now()
  };
}

export function resetAtmosphereProfile(
  profile: UserAtmosphereProfile
): UserAtmosphereProfile {
  return {
    ...profile,
    preferredModes: ["drift", "comfort", "focus"],
    currentMode: "drift",
    energyTolerance: 50,
    comfortBias: 60,
    chaosTolerance: 35,
    updatedAt: Date.now()
  };
}
