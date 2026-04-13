export type IdentitySafetyOverridesInput = {
  userId: string;
  ageGateRequired: boolean;
  sensitivityBlocked: boolean;
  rightsBlocked: boolean;
  culturalSuppressionActive: boolean;
  liveRoomOptIn: boolean;
  predictionPickOptIn: boolean;
  versusOptIn: boolean;
};

export type IdentitySafetyOverridesDecision = {
  allowIdentityPersonalization: boolean;
  allowInteractiveSurfaces: boolean;
  mode:
    | "normal"
    | "safe-filtered"
    | "interactive-disabled"
    | "suppressed";
  reason:
    | "ok"
    | "age_gate_required"
    | "sensitivity_blocked"
    | "rights_blocked"
    | "cultural_suppression_active";
};

export function resolveIdentitySafetyOverrides(
  input: IdentitySafetyOverridesInput
): IdentitySafetyOverridesDecision {
  if (input.culturalSuppressionActive) {
    return {
      allowIdentityPersonalization: false,
      allowInteractiveSurfaces: false,
      mode: "suppressed",
      reason: "cultural_suppression_active",
    };
  }

  if (input.rightsBlocked) {
    return {
      allowIdentityPersonalization: true,
      allowInteractiveSurfaces: false,
      mode: "interactive-disabled",
      reason: "rights_blocked",
    };
  }

  if (input.sensitivityBlocked) {
    return {
      allowIdentityPersonalization: true,
      allowInteractiveSurfaces: false,
      mode: "safe-filtered",
      reason: "sensitivity_blocked",
    };
  }

  if (input.ageGateRequired) {
    return {
      allowIdentityPersonalization: true,
      allowInteractiveSurfaces: false,
      mode: "safe-filtered",
      reason: "age_gate_required",
    };
  }

  const allowInteractiveSurfaces =
    input.liveRoomOptIn || input.predictionPickOptIn || input.versusOptIn;

  return {
    allowIdentityPersonalization: true,
    allowInteractiveSurfaces,
    mode: "normal",
    reason: "ok",
  };
}

export function canUseIdentityPersonalizationSafely(
  input: IdentitySafetyOverridesInput
): boolean {
  return resolveIdentitySafetyOverrides(input).allowIdentityPersonalization;
}
