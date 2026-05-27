import type { MotionMode, MotionPolicy } from "./types";

export function buildMotionPolicy(mode: MotionMode): MotionPolicy {
  if (mode === "off") {
    return {
      mode,
      allowPulse: false,
      allowParallax: false,
      allowAmbientDrift: false
    };
  }

  if (mode === "reduced") {
    return {
      mode,
      allowPulse: true,
      allowParallax: false,
      allowAmbientDrift: false
    };
  }

  return {
    mode,
    allowPulse: true,
    allowParallax: true,
    allowAmbientDrift: true
  };
}
