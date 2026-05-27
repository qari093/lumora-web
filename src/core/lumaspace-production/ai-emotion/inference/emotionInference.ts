import type { EmotionSignal } from "../types";

export function inferAtmosphere(input: string): EmotionSignal {
  return {
    id: "emotion_signal_001",
    atmosphere: input.trim().length > 0 ? "wonder" : "calm",
    confidence: 0.72
  };
}
