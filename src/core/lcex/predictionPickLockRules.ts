export type PredictionPickLockRulesInput = {
  status: "draft" | "open" | "locked" | "resolved" | "cancelled";
  opensAt?: string;
  locksAt?: string;
  totalPredictions: number;
  minimumPredictions?: number;
  safetyBlocked: boolean;
};

export type PredictionPickLockRulesDecision = {
  lockable: boolean;
  reason:
    | "ok"
    | "status_not_open"
    | "locks_at_missing"
    | "lock_time_not_reached"
    | "insufficient_predictions"
    | "safety_blocked";
};

export function resolvePredictionPickLockRules(
  input: PredictionPickLockRulesInput
): PredictionPickLockRulesDecision {
  if (input.status !== "open") {
    return { lockable: false, reason: "status_not_open" };
  }

  if (input.safetyBlocked) {
    return { lockable: false, reason: "safety_blocked" };
  }

  if (!input.locksAt) {
    return { lockable: false, reason: "locks_at_missing" };
  }

  const locksTs = Date.parse(input.locksAt);
  if (Number.isNaN(locksTs) || Date.now() < locksTs) {
    return { lockable: false, reason: "lock_time_not_reached" };
  }

  const minimumPredictions = input.minimumPredictions ?? 10;
  if (input.totalPredictions < minimumPredictions) {
    return { lockable: false, reason: "insufficient_predictions" };
  }

  return { lockable: true, reason: "ok" };
}

export function canLockPredictionPick(
  input: PredictionPickLockRulesInput
): boolean {
  return resolvePredictionPickLockRules(input).lockable;
}
