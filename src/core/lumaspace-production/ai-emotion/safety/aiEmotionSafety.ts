import type { AiSafetyDecision, EmotionSignal } from "../types";

export function evaluateAiEmotionSafety(signal: EmotionSignal): AiSafetyDecision {
  return {
    allowed: signal.confidence <= 1,
    reason: "poetic_interpretation_only"
  };
}
