import type { AtmosphereMode } from "../core/types";

export type UserAtmosphereProfile = {
  userId: string;
  preferredModes: AtmosphereMode[];
  currentMode: AtmosphereMode;
  energyTolerance: number;
  comfortBias: number;
  chaosTolerance: number;
  personalizationEnabled: boolean;
  updatedAt: number;
};

export function createUserAtmosphereProfile(
  userId: string
): UserAtmosphereProfile {
  if (!userId.trim()) {
    throw new Error("Atmosphere profile requires userId.");
  }

  return {
    userId,
    preferredModes: ["drift", "comfort", "focus"],
    currentMode: "drift",
    energyTolerance: 50,
    comfortBias: 60,
    chaosTolerance: 35,
    personalizationEnabled: true,
    updatedAt: Date.now()
  };
}

export function assertValidAtmosphereProfile(
  profile: UserAtmosphereProfile
): true {
  if (
    !profile.userId.trim() ||
    profile.energyTolerance < 0 ||
    profile.energyTolerance > 100 ||
    profile.comfortBias < 0 ||
    profile.comfortBias > 100 ||
    profile.chaosTolerance < 0 ||
    profile.chaosTolerance > 100
  ) {
    throw new Error("Invalid Lumora atmosphere profile.");
  }

  return true;
}
