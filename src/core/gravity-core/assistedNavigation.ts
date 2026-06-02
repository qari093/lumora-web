import type { GravityAssistedDecision } from "./assistedTypes";

export type GravityAssistedNavigationDecision = {
  integrated: boolean;
  enabled: boolean;
  softNavigationPrepared: boolean;
  confirmationRequired: true;
  target: "/" | null;
  canNavigate: false;
  reason: string;
};

export function computeAssistedNavigation(decision: GravityAssistedDecision): GravityAssistedNavigationDecision {
  if (!decision.enabled) {
    return {
      integrated: true,
      enabled: false,
      softNavigationPrepared: false,
      confirmationRequired: true,
      target: null,
      canNavigate: false,
      reason: "assisted_navigation_disabled",
    };
  }

  if (decision.stage !== "ready_to_assist" || !decision.canSuggestReturn) {
    return {
      integrated: true,
      enabled: true,
      softNavigationPrepared: false,
      confirmationRequired: true,
      target: null,
      canNavigate: false,
      reason: "assist_not_ready",
    };
  }

  return {
    integrated: true,
    enabled: true,
    softNavigationPrepared: true,
    confirmationRequired: true,
    target: "/",
    canNavigate: false,
    reason: "soft_navigation_prepared_confirmation_required",
  };
}
