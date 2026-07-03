import type { TrustPolicy, TrustSafetyResult } from "./types";
import { calculateRelationshipTrustScore } from "./scoring";
import { createSafetySignal, hasBlockingSignal } from "./signals";

export function createTrustPolicy(input: Partial<TrustPolicy> & { actorId: string }): TrustPolicy {
  return {
    actorId: input.actorId,
    recipientId: input.recipientId,
    minTrustScore: input.minTrustScore ?? 0.45,
    allowExternal: input.allowExternal ?? false,
    requireConsent: input.requireConsent ?? true,
    blockedActorIds: input.blockedActorIds ?? [],
    mutedActorIds: input.mutedActorIds ?? [],
  };
}

export function evaluateTrustSafety(params: {
  policy: TrustPolicy;
  actorId: string;
  recipientId?: string;
  baseTrust: number;
  priorShares: number;
  successfulDeliveries: number;
  consentGranted: boolean;
  external: boolean;
  existingSignals?: ReturnType<typeof createSafetySignal>[];
}): TrustSafetyResult {
  const signals = [...(params.existingSignals ?? [])];

  if (params.policy.blockedActorIds.includes(params.actorId)) {
    signals.push(createSafetySignal("blocked_actor", 1, "Actor is blocked."));
  }

  if (params.policy.requireConsent && !params.consentGranted) {
    signals.push(createSafetySignal("consent_missing", 0.72, "Recipient consent is missing."));
  }

  if (params.external && !params.policy.allowExternal) {
    signals.push(createSafetySignal("sensitive_content", 0.58, "External sharing is restricted."));
  }

  const trustScore = calculateRelationshipTrustScore({
    baseTrust: params.baseTrust,
    priorShares: params.priorShares,
    successfulDeliveries: params.successfulDeliveries,
    safetySignals: signals,
  });

  if (hasBlockingSignal(signals)) {
    return { decision: "block", trustScore, signals, requiredActions: ["stop_delivery", "write_audit_log"] };
  }

  if (trustScore < params.policy.minTrustScore || signals.some((signal) => signal.score >= 0.65)) {
    return { decision: "review", trustScore, signals, requiredActions: ["manual_review", "limit_notification"] };
  }

  if (signals.length > 0) {
    return { decision: "limit", trustScore, signals, requiredActions: ["quiet_delivery", "write_audit_log"] };
  }

  return { decision: "allow", trustScore, signals, requiredActions: ["write_audit_log"] };
}
