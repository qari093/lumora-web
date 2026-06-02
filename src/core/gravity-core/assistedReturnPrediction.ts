import type { GravityAssistedDecision } from "./assistedTypes";

export type GravityReturnPrediction = {
  likelyReturnIntent: boolean;
  confidence: number;
  reason: string;
};

export function predictAssistedReturn(decision: GravityAssistedDecision): GravityReturnPrediction {
  const likelyReturnIntent =
    decision.enabled &&
    decision.stage === "ready_to_assist" &&
    decision.canSuggestReturn &&
    decision.confidence >= 0.88;

  return {
    likelyReturnIntent,
    confidence: decision.confidence,
    reason: likelyReturnIntent ? "high_confidence_return_intent" : "return_intent_not_confirmed",
  };
}
