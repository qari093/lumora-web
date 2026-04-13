export type TrendBountyRewardReleaseInput = {
  winnerResolved: boolean;
  reviewCompleted: boolean;
  fraudBlocked: boolean;
  safetyBlocked: boolean;
  rewardPoolReady: boolean;
};

export type TrendBountyRewardReleaseDecision = {
  releasable: boolean;
  reason:
    | "ok"
    | "winner_not_resolved"
    | "review_not_completed"
    | "fraud_blocked"
    | "safety_blocked"
    | "reward_pool_not_ready";
};

export function resolveTrendBountyRewardRelease(
  input: TrendBountyRewardReleaseInput
): TrendBountyRewardReleaseDecision {
  if (!input.winnerResolved) {
    return { releasable: false, reason: "winner_not_resolved" };
  }

  if (!input.reviewCompleted) {
    return { releasable: false, reason: "review_not_completed" };
  }

  if (input.fraudBlocked) {
    return { releasable: false, reason: "fraud_blocked" };
  }

  if (input.safetyBlocked) {
    return { releasable: false, reason: "safety_blocked" };
  }

  if (!input.rewardPoolReady) {
    return { releasable: false, reason: "reward_pool_not_ready" };
  }

  return { releasable: true, reason: "ok" };
}

export function canReleaseTrendBountyReward(
  input: TrendBountyRewardReleaseInput
): boolean {
  return resolveTrendBountyRewardRelease(input).releasable;
}
