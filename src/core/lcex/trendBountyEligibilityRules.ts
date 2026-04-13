export type TrendBountyEligibilityInput = {
  accountAgeDays: number;
  previousQualifiedSubmissions: number;
  reputationScore: number;
  regionAllowed: boolean;
  blocked: boolean;
  cooldownActive: boolean;
};

export type TrendBountyEligibilityDecision = {
  eligible: boolean;
  reason:
    | "ok"
    | "blocked"
    | "region_not_allowed"
    | "cooldown_active"
    | "account_too_new"
    | "low_reputation";
};

export function resolveTrendBountyEligibility(
  input: TrendBountyEligibilityInput
): TrendBountyEligibilityDecision {
  if (input.blocked) {
    return { eligible: false, reason: "blocked" };
  }

  if (!input.regionAllowed) {
    return { eligible: false, reason: "region_not_allowed" };
  }

  if (input.cooldownActive) {
    return { eligible: false, reason: "cooldown_active" };
  }

  if (input.accountAgeDays < 3 && input.previousQualifiedSubmissions < 1) {
    return { eligible: false, reason: "account_too_new" };
  }

  if (input.reputationScore < 40) {
    return { eligible: false, reason: "low_reputation" };
  }

  return { eligible: true, reason: "ok" };
}

export function canSubmitTrendBounty(
  input: TrendBountyEligibilityInput
): boolean {
  return resolveTrendBountyEligibility(input).eligible;
}
