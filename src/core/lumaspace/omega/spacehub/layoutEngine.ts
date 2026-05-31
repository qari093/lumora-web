import type { DeviceTier } from "./types";

export type SpaceHubLayoutProfile = {
  deviceTier: DeviceTier;
  mode: "immersive" | "balanced" | "lite";
  maxOrbitEntities: number;
  shaderLevel: "full" | "soft" | "flat";
  videoAutoplay: boolean;
  haptics: boolean;
  targetFps: 30 | 45 | 60;
};

export function createLayoutProfile(input: {
  deviceTier: DeviceTier;
  reducedMotion?: boolean;
  lowPower?: boolean;
}): SpaceHubLayoutProfile {
  const reducedMotion = input.reducedMotion === true;
  const lowPower = input.lowPower === true;

  if (input.deviceTier === "low" || lowPower) {
    return {
      deviceTier: input.deviceTier,
      mode: "lite",
      maxOrbitEntities: 12,
      shaderLevel: "flat",
      videoAutoplay: false,
      haptics: !reducedMotion,
      targetFps: 30,
    };
  }

  if (input.deviceTier === "mid" || reducedMotion) {
    return {
      deviceTier: input.deviceTier,
      mode: "balanced",
      maxOrbitEntities: 24,
      shaderLevel: "soft",
      videoAutoplay: !reducedMotion,
      haptics: !reducedMotion,
      targetFps: 45,
    };
  }

  return {
    deviceTier: "high",
    mode: "immersive",
    maxOrbitEntities: 40,
    shaderLevel: "full",
    videoAutoplay: true,
    haptics: true,
    targetFps: 60,
  };
}
