export type FandomBadgeEligibilityInput = {
  badgeStatus: "draft" | "active" | "retired";
  accountAgeDays: number;
  engagementCount: number;
  affinityScore: number;
  blocked: boolean;
  regionAllowed: boolean;
};

export type FandomBadgeEligibilityDecision = {
  eligible: boolean;
  reason:
    | "ok"
    | "badge_not_active"
    | "user_blocked"
    | "region_not_allowed"
    | "account_too_new"
    | "insufficient_engagement"
    | "low_affinity";
};

export function resolveFandomBadgeEligibility(
  input: FandomBadgeEligibilityInput
): FandomBadgeEligibilityDecision {
  if (input.badgeStatus !== "active") {
    return { eligible: false, reason: "badge_not_active" };
  }

  if (input.blocked) {
    return { eligible: false, reason: "user_blocked" };
  }

  if (!input.regionAllowed) {
    return { eligible: false, reason: "region_not_allowed" };
  }

  if (input.accountAgeDays < 3) {
    return { eligible: false, reason: "account_too_new" };
  }

  if (input.engagementCount < 5) {
    return { eligible: false, reason: "insufficient_engagement" };
  }

  if (input.affinityScore < 50) {
    return { eligible: false, reason: "low_affinity" };
  }

  return { eligible: true, reason: "ok" };
}

export function canEarnFandomBadge(
  input: FandomBadgeEligibilityInput
): boolean {
  return resolveFandomBadgeEligibility(input).eligible;
}
