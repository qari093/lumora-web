import {
  createRawLensWhimsy
} from "./rawLensWhimsy";

import {
  createGlitchSparkPlan
} from "./glitchSpark";

import {
  createEmotionRoulette
} from "./emotionRoulette";

export function runWhimsyRuntime(
  sparkId: string
) {
  return {
    active: true,
    effect: createRawLensWhimsy("soft_absurd", 0.4),
    glitch: createGlitchSparkPlan(sparkId, 2),
    roulette: createEmotionRoulette("calm", 1)
  };
}
