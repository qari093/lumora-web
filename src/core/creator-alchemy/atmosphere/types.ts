export type AtmosphereMood =
  | "quiet"
  | "reflective"
  | "blooming"
  | "returning"
  | "soft"
  | "open";

export type MotionMode = "full" | "reduced" | "off";
export type AtmosphereIntensity = "none" | "soft" | "active";

export interface AtmospherePalette {
  mood: AtmosphereMood;
  gradient: string;
  glow: string;
  contrastSafe: boolean;
}

export interface MotionPolicy {
  mode: MotionMode;
  allowPulse: boolean;
  allowParallax: boolean;
  allowAmbientDrift: boolean;
}

export interface AtmosphereState {
  mood: AtmosphereMood;
  intensity: AtmosphereIntensity;
  palette: AtmospherePalette;
  motion: MotionPolicy;
  usabilitySafe: boolean;
}

export interface SilentPulseState {
  visible: boolean;
  words: false;
  meaning: "constellation_alive" | "none";
}

export interface OneNightSkyVisualState {
  active: boolean;
  optional: true;
  blocksNavigation: false;
  durationMinutes: number;
}
