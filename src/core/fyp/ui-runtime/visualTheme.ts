import type {
  FypVisualMode,
  FypVisualTheme
} from "./types";

export function createFypVisualTheme(
  mode: FypVisualMode
): FypVisualTheme {
  const map: Record<FypVisualMode, FypVisualTheme> = {
    calm: {
      mode,
      aura: "soft-blue",
      motion: "soft",
      intensity: 24
    },
    drift: {
      mode,
      aura: "violet-neon",
      motion: "fluid",
      intensity: 48
    },
    chaos: {
      mode,
      aura: "red-electric",
      motion: "electric",
      intensity: 82
    },
    pulse: {
      mode,
      aura: "gold-surge",
      motion: "surge",
      intensity: 95
    }
  };

  return map[mode];
}
