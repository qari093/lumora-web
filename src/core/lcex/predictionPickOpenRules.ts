export type PredictionPickOpenRulesInput = {
  status: "draft" | "open" | "locked" | "resolved" | "cancelled";
  opensAt?: string;
  locksAt?: string;
  rightsScore: number;
  culturalScore: number;
  safetyBlocked: boolean;
};

export type PredictionPickOpenRulesDecision = {
  openable: boolean;
  reason:
    | "ok"
    | "status_not_draft"
    | "opens_at_missing"
    | "invalid_time_window"
    | "low_rights"
    | "low_cultural_confidence"
    | "safety_blocked";
};

export function resolvePredictionPickOpenRules(
  input: PredictionPickOpenRulesInput
): PredictionPickOpenRulesDecision {
  if (input.status !== "draft") {
    return { openable: false, reason: "status_not_draft" };
  }

  if (!input.opensAt) {
    return { openable: false, reason: "opens_at_missing" };
  }

  const opensTs = Date.parse(input.opensAt);
  const locksTs = Date.parse(input.locksAt ?? "");

  if (Number.isNaN(opensTs) || (!Number.isNaN(locksTs) && locksTs <= opensTs)) {
    return { openable: false, reason: "invalid_time_window" };
  }

  if (input.safetyBlocked) {
    return { openable: false, reason: "safety_blocked" };
  }

  if (input.rightsScore < 55) {
    return { openable: false, reason: "low_rights" };
  }

  if (input.culturalScore < 55) {
    return { openable: false, reason: "low_cultural_confidence" };
  }

  return { openable: true, reason: "ok" };
}

export function canOpenPredictionPick(
  input: PredictionPickOpenRulesInput
): boolean {
  return resolvePredictionPickOpenRules(input).openable;
}
