import type { AiEmotionRuntime } from "../types";
import { inferAtmosphere } from "../inference/emotionInference";
import { evaluateAiEmotionSafety } from "../safety/aiEmotionSafety";

export function runAiEmotionRuntime(input = "soft morning"): AiEmotionRuntime {
  const signal = inferAtmosphere(input);

  return {
    active: true,
    signal,
    decision: evaluateAiEmotionSafety(signal)
  };
}
