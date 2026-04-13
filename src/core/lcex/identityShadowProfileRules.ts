export type IdentityShadowProfileRulesInput = {
  explicitProfileReady: boolean;
  behaviorSignalsAvailable: boolean;
  consentGranted: boolean;
  safetyBlocked: boolean;
};

export type IdentityShadowProfileRulesDecision = {
  canUseShadowProfile: boolean;
  mode: "disabled" | "shadow-only" | "explicit-primary";
  reason:
    | "ok"
    | "explicit_profile_ready"
    | "missing_behavior_signals"
    | "consent_not_granted"
    | "safety_blocked";
};

export function resolveIdentityShadowProfileRules(
  input: IdentityShadowProfileRulesInput
): IdentityShadowProfileRulesDecision {
  if (input.safetyBlocked) {
    return {
      canUseShadowProfile: false,
      mode: "disabled",
      reason: "safety_blocked",
    };
  }

  if (!input.consentGranted) {
    return {
      canUseShadowProfile: false,
      mode: "disabled",
      reason: "consent_not_granted",
    };
  }

  if (input.explicitProfileReady) {
    return {
      canUseShadowProfile: false,
      mode: "explicit-primary",
      reason: "explicit_profile_ready",
    };
  }

  if (!input.behaviorSignalsAvailable) {
    return {
      canUseShadowProfile: false,
      mode: "disabled",
      reason: "missing_behavior_signals",
    };
  }

  return {
    canUseShadowProfile: true,
    mode: "shadow-only",
    reason: "ok",
  };
}

export function shouldUseIdentityShadowProfile(
  input: IdentityShadowProfileRulesInput
): boolean {
  return resolveIdentityShadowProfileRules(input).canUseShadowProfile;
}
