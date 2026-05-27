import type { AtmosphereMode } from "../core/types";

export type AtmosphericMotionProfile = {
  mode: AtmosphereMode;
  transitionMs: number;
  depth: number;
  glow: number;
  breathingSpace: number;
};

export function createAtmosphericMotionProfile(
  mode: AtmosphereMode
): AtmosphericMotionProfile {
  const profiles: Record<AtmosphereMode, AtmosphericMotionProfile> = {
    comfort: { mode, transitionMs: 420, depth: 35, glow: 28, breathingSpace: 80 },
    drift: { mode, transitionMs: 560, depth: 55, glow: 42, breathingSpace: 95 },
    chaos: { mode, transitionMs: 180, depth: 80, glow: 88, breathingSpace: 35 },
    deep: { mode, transitionMs: 640, depth: 60, glow: 38, breathingSpace: 100 },
    energy: { mode, transitionMs: 240, depth: 70, glow: 74, breathingSpace: 45 },
    focus: { mode, transitionMs: 360, depth: 30, glow: 22, breathingSpace: 70 },
    wonder: { mode, transitionMs: 520, depth: 75, glow: 58, breathingSpace: 85 }
  };

  return profiles[mode];
}
