export type UserControlResetRulesInput = {
  blocked: boolean;
  safetyMode: "normal" | "safe-filtered" | "interactive-disabled" | "suppressed";
  resetTarget:
    | "all"
    | "discovery"
    | "interactive"
    | "identity"
    | "badges"
    | "boards";
};

export type UserControlResetRulesDecision = {
  allowed: boolean;
  resetKeys: string[];
  reason:
    | "ok"
    | "user_blocked"
    | "suppressed_mode";
};

export function resolveUserControlResetRules(
  input: UserControlResetRulesInput
): UserControlResetRulesDecision {
  if (input.blocked) {
    return {
      allowed: false,
      resetKeys: [],
      reason: "user_blocked",
    };
  }

  if (input.safetyMode === "suppressed") {
    return {
      allowed: false,
      resetKeys: [],
      reason: "suppressed_mode",
    };
  }

  const allKeys = [
    "discoveryIntensity",
    "noveltyOptIn",
    "liveRoomOptIn",
    "versusOptIn",
    "predictionPickOptIn",
    "streakRewardsOptIn",
    "moodBoardsOptIn",
    "fandomBadgesOptIn",
  ];

  const groups: Record<UserControlResetRulesInput["resetTarget"], string[]> = {
    all: allKeys,
    discovery: ["discoveryIntensity", "noveltyOptIn"],
    interactive: ["liveRoomOptIn", "versusOptIn", "predictionPickOptIn"],
    identity: ["discoveryIntensity", "noveltyOptIn"],
    badges: ["fandomBadgesOptIn", "streakRewardsOptIn"],
    boards: ["moodBoardsOptIn"],
  };

  return {
    allowed: true,
    resetKeys: groups[input.resetTarget],
    reason: "ok",
  };
}

export function canResetUserControls(
  input: UserControlResetRulesInput
): boolean {
  return resolveUserControlResetRules(input).allowed;
}
