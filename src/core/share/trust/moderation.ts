import type { SafetySignal, TrustDecision } from "./types";

export function createModerationHook(params: {
  objectId: string;
  signals: SafetySignal[];
  decision: TrustDecision;
}) {
  return {
    id: `moderation_${params.objectId}_${params.decision}`,
    objectId: params.objectId,
    decision: params.decision,
    queue: params.decision === "review" || params.decision === "block" ? "trust_safety_review" : "none",
    signalKinds: params.signals.map((signal) => signal.kind),
  };
}
