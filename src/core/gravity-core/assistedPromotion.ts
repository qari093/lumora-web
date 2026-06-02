import type { GravityAssistedDecision, GravityAssistedInput } from "./assistedTypes";

export function promoteGravityIntentToAssisted(input: GravityAssistedInput): GravityAssistedDecision {
  const fallbackAvailable = input.fallbackAvailable !== false;
  const telemetryHealthy = input.telemetryHealthy !== false;
  const rolloutAllowed = input.rolloutAllowed === true;

  if (!input.assistedEnabled) {
    return {
      integrated: true,
      enabled: false,
      stage: "disabled",
      canRevealPortal: false,
      canSuggestReturn: false,
      canNavigate: false,
      confidence: input.intent.confidence,
      reason: "assisted_mode_disabled_by_flag",
    };
  }

  if (!fallbackAvailable) {
    return {
      integrated: true,
      enabled: true,
      stage: "blocked",
      canRevealPortal: false,
      canSuggestReturn: false,
      canNavigate: false,
      confidence: input.intent.confidence,
      reason: "fallback_unavailable",
    };
  }

  if (!telemetryHealthy) {
    return {
      integrated: true,
      enabled: true,
      stage: "blocked",
      canRevealPortal: false,
      canSuggestReturn: false,
      canNavigate: false,
      confidence: input.intent.confidence,
      reason: "telemetry_unhealthy",
    };
  }

  if (input.conflictActive) {
    return {
      integrated: true,
      enabled: true,
      stage: "blocked",
      canRevealPortal: false,
      canSuggestReturn: false,
      canNavigate: false,
      confidence: input.intent.confidence,
      reason: "ui_conflict_active",
    };
  }

  if (!rolloutAllowed) {
    return {
      integrated: true,
      enabled: true,
      stage: "observing",
      canRevealPortal: false,
      canSuggestReturn: false,
      canNavigate: false,
      confidence: input.intent.confidence,
      reason: "rollout_not_allowed",
    };
  }

  if (input.intent.confidence >= 0.88 && input.intent.shouldShowRing) {
    return {
      integrated: true,
      enabled: true,
      stage: "ready_to_assist",
      canRevealPortal: true,
      canSuggestReturn: true,
      canNavigate: false,
      confidence: input.intent.confidence,
      reason: "high_confidence_assist_ready",
    };
  }

  if (input.intent.intentScore >= 0.62) {
    return {
      integrated: true,
      enabled: true,
      stage: "candidate",
      canRevealPortal: true,
      canSuggestReturn: false,
      canNavigate: false,
      confidence: input.intent.confidence,
      reason: "assist_candidate",
    };
  }

  return {
    integrated: true,
    enabled: true,
    stage: "observing",
    canRevealPortal: false,
    canSuggestReturn: false,
    canNavigate: false,
    confidence: input.intent.confidence,
    reason: "observing",
  };
}
