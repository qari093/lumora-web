import type {
  WeeklyReflection
} from "../conductor/types";

import type { AtmosphereMode } from "../core/types";

export function createWeeklyReflection(input: {
  userId: string;
  dominantMode: AtmosphereMode;
  atmosphereHours: number;
  emotionalSignature: string;
}): WeeklyReflection {
  if (!input.userId.trim()) {
    throw new Error("Weekly reflection requires userId.");
  }

  return {
    reflectionId: `reflection_${input.userId}_${Date.now()}`,
    userId: input.userId,
    dominantMode: input.dominantMode,
    atmosphereHours: input.atmosphereHours,
    emotionalSignature: input.emotionalSignature,
    shareable: true
  };
}
