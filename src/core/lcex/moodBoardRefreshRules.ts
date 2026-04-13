export type MoodBoardRefreshRulesInput = {
  status: "draft" | "active" | "cooldown" | "archived";
  freshnessScore: number;
  engagementScore: number;
  fatigueScore: number;
  safetyBlocked: boolean;
  updatedAt?: string;
  refreshCooldownHours?: number;
};

export type MoodBoardRefreshRulesDecision = {
  refreshable: boolean;
  reason:
    | "ok"
    | "status_not_active"
    | "refresh_cooldown_active"
    | "high_fatigue"
    | "low_freshness"
    | "safety_blocked";
};

export function resolveMoodBoardRefreshRules(
  input: MoodBoardRefreshRulesInput
): MoodBoardRefreshRulesDecision {
  if (input.status !== "active") {
    return { refreshable: false, reason: "status_not_active" };
  }

  if (input.safetyBlocked) {
    return { refreshable: false, reason: "safety_blocked" };
  }

  if (input.fatigueScore >= 75) {
    return { refreshable: false, reason: "high_fatigue" };
  }

  const refreshCooldownHours = input.refreshCooldownHours ?? 12;
  if (input.updatedAt) {
    const updatedTs = Date.parse(input.updatedAt);
    if (!Number.isNaN(updatedTs)) {
      const elapsedHours = (Date.now() - updatedTs) / (1000 * 60 * 60);
      if (elapsedHours < refreshCooldownHours) {
        return { refreshable: false, reason: "refresh_cooldown_active" };
      }
    }
  }

  if (input.freshnessScore >= 70) {
    return { refreshable: false, reason: "low_freshness" };
  }

  return { refreshable: true, reason: "ok" };
}

export function canRefreshMoodBoard(
  input: MoodBoardRefreshRulesInput
): boolean {
  return resolveMoodBoardRefreshRules(input).refreshable;
}
