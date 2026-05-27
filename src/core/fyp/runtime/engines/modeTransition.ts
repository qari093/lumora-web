import type {
  RuntimeDecision,
  RuntimeMode
} from "../types";

export function evaluateModeTransition(input: {
  currentMode: RuntimeMode;
  emotionalLoad: number;
  chaosBudget: number;
}): RuntimeDecision {
  if (input.emotionalLoad >= 85) {
    return {
      allowed: true,
      nextMode: "calm",
      injectChaos: false,
      cooldownRecommended: true
    };
  }

  if (
    input.currentMode === "drift" &&
    input.chaosBudget >= 70
  ) {
    return {
      allowed: true,
      nextMode: "chaos",
      injectChaos: true,
      cooldownRecommended: false
    };
  }

  return {
    allowed: true,
    nextMode: input.currentMode,
    injectChaos: false,
    cooldownRecommended: false
  };
}
