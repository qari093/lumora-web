import type { EmotionSignal, AiSafetyDecision, AiEmotionRuntime } from "../types";

export function validateEmotionSignal(signal: EmotionSignal): boolean {
  return Boolean(signal.id && signal.atmosphere && signal.confidence >= 0 && signal.confidence <= 1);
}

export function validateAiSafetyDecision(decision: AiSafetyDecision): boolean {
  return Boolean(typeof decision.allowed === "boolean" && decision.reason);
}

export function validateAiEmotionRuntime(runtime: AiEmotionRuntime): boolean {
  return Boolean(runtime.active === true && validateEmotionSignal(runtime.signal) && validateAiSafetyDecision(runtime.decision));
}
