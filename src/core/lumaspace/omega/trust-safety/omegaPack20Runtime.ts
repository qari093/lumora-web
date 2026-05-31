import { createSafetySignal, signalRequiresReview } from "./safetyEngine";
import { createModerationDecision } from "./moderationEngine";
import { applySafetySignalToTrust, createTrustProfile } from "./trustEngine";

export function runLumaSpaceOmegaMegaPack20Runtime() {
  const profile = createTrustProfile({ citizenId: "citizen-020", trustScore: 85, reliabilityScore: 90 });

  const signal = createSafetySignal({
    id: "safety-020",
    targetId: "signal-020",
    targetType: "signal",
    severity: "medium",
    reason: "needs_context_review",
  });

  const decision = createModerationDecision(signal);
  const updated = applySafetySignalToTrust(profile, signal);

  return {
    ok:
      signalRequiresReview(signal) &&
      decision.action === "review" &&
      decision.transparent &&
      decision.appealable &&
      updated.trustScore < profile.trustScore &&
      !updated.limited,
    profile,
    signal,
    decision,
    updated,
  };
}
