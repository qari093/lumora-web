import type { DreamChamberRuntime, RuntimeConstellation } from "./types";

export function buildDreamChamberRuntime(input: {
  constellation: RuntimeConstellation;
  resonance: number;
  daysUntilEvent: number | null;
  activeNow: boolean;
}): DreamChamberRuntime {
  const strong = input.resonance >= 0.72;

  return {
    active: strong && input.activeNow,
    preGlow: strong && typeof input.daysUntilEvent === "number" && input.daysUntilEvent > 0 && input.daysUntilEvent <= 3,
    constellation: input.constellation,
    likesHidden: true,
    commentsHidden: true,
    presenceOnly: true
  };
}
