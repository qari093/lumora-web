import type { ModerationDecision, SafetySignal } from "./types";

export function createModerationDecision(signal: SafetySignal): ModerationDecision {
  const action =
    signal.severity === "high" ? "remove" :
    signal.severity === "medium" ? "review" :
    "allow";

  return {
    id: `moderation_${signal.id}`,
    signalId: signal.id,
    action,
    transparent: true,
    appealable: action !== "allow",
  };
}
