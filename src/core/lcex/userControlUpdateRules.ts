export type UserControlUpdateRulesInput = {
  userId: string;
  requestedKeys: string[];
  safetyMode: "normal" | "safe-filtered" | "interactive-disabled" | "suppressed";
  ageGateRequired: boolean;
  blocked: boolean;
};

export type UserControlUpdateRulesDecision = {
  allowed: boolean;
  blockedKeys: string[];
  reason:
    | "ok"
    | "user_blocked"
    | "suppressed_mode"
    | "age_gate_required"
    | "interactive_disabled";
};

const INTERACTIVE_KEYS = new Set([
  "liveRoomOptIn",
  "versusOptIn",
  "predictionPickOptIn",
]);

export function resolveUserControlUpdateRules(
  input: UserControlUpdateRulesInput
): UserControlUpdateRulesDecision {
  if (input.blocked) {
    return {
      allowed: false,
      blockedKeys: input.requestedKeys,
      reason: "user_blocked",
    };
  }

  if (input.safetyMode === "suppressed") {
    return {
      allowed: false,
      blockedKeys: input.requestedKeys,
      reason: "suppressed_mode",
    };
  }

  const blockedKeys: string[] = [];

  for (const key of input.requestedKeys) {
    if (
      input.ageGateRequired &&
      (key === "liveRoomOptIn" || key === "versusOptIn")
    ) {
      blockedKeys.push(key);
      continue;
    }

    if (
      input.safetyMode === "interactive-disabled" &&
      INTERACTIVE_KEYS.has(key)
    ) {
      blockedKeys.push(key);
    }
  }

  if (blockedKeys.length > 0) {
    return {
      allowed: blockedKeys.length !== input.requestedKeys.length,
      blockedKeys,
      reason:
        input.ageGateRequired && blockedKeys.some((key) => key === "liveRoomOptIn" || key === "versusOptIn")
          ? "age_gate_required"
          : "interactive_disabled",
    };
  }

  return {
    allowed: true,
    blockedKeys: [],
    reason: "ok",
  };
}

export function canUpdateUserControls(
  input: UserControlUpdateRulesInput
): boolean {
  return resolveUserControlUpdateRules(input).allowed;
}
