export const creativeMatchPolicy = {
  rareCampaignsOnly: true,
  seasonalBoosts: true,
  launchCelebrations: true,
  creatorMilestones: true,
  antiInflationGuard: true,
  adminToggleRequired: true,
  auditTrail: true
} as const;

export function canRunCreativeMatch(input: {
  campaignEnabled: boolean;
  campaignType: "seasonal" | "launch" | "creator-milestone" | "always-on";
}): boolean {
  if (!input.campaignEnabled) return false;
  return input.campaignType !== "always-on";
}

export function calculateCreativeMatchBonus(input: {
  purchasedZc: number;
  bonusRate: number;
}): number {
  const cappedRate = Math.min(Math.max(input.bonusRate, 0), 0.2);
  return Math.floor(input.purchasedZc * cappedRate);
}

export function creativeMatchHealthy(): boolean {
  return (
    creativeMatchPolicy.rareCampaignsOnly &&
    creativeMatchPolicy.antiInflationGuard &&
    creativeMatchPolicy.adminToggleRequired &&
    creativeMatchPolicy.auditTrail &&
    canRunCreativeMatch({ campaignEnabled: true, campaignType: "seasonal" }) &&
    !canRunCreativeMatch({ campaignEnabled: true, campaignType: "always-on" })
  );
}
