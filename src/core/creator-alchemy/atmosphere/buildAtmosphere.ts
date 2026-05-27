import type { AtmosphereIntensity, AtmosphereMood, AtmosphereState, MotionMode } from "./types";
import { getAtmospherePalette, validatePaletteAccessibility } from "./palette";
import { buildMotionPolicy } from "./motion";

export function buildAtmosphereState(input: {
  mood: AtmosphereMood;
  intensity: AtmosphereIntensity;
  motionMode: MotionMode;
  navigationVisible: boolean;
  primaryActionVisible: boolean;
}): AtmosphereState {
  const palette = getAtmospherePalette(input.mood);
  const motion = buildMotionPolicy(input.motionMode);

  return {
    mood: input.mood,
    intensity: input.intensity,
    palette,
    motion,
    usabilitySafe:
      validatePaletteAccessibility(palette) &&
      input.navigationVisible &&
      input.primaryActionVisible
  };
}
