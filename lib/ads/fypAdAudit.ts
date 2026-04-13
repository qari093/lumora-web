export type FypAdAuditInput = {
  totalFeedItems: number;
  sponsoredItems: number;
  injectedAds: number;
  eligibleAds: number;
};

export type FypAdAuditResult = {
  totalFeedItems: number;
  sponsoredItems: number;
  injectedAds: number;
  eligibleAds: number;
  sponsoredRatio: number;
  injectionRatio: number;
  eligibilityRatio: number;
  healthy: boolean;
};

export function createFypAdAudit(input: FypAdAuditInput): FypAdAuditResult {
  const totalFeedItems = Math.max(0, Math.floor(input.totalFeedItems ?? 0));
  const sponsoredItems = Math.max(0, Math.floor(input.sponsoredItems ?? 0));
  const injectedAds = Math.max(0, Math.floor(input.injectedAds ?? 0));
  const eligibleAds = Math.max(0, Math.floor(input.eligibleAds ?? 0));

  const sponsoredRatio =
    totalFeedItems === 0 ? 0 : Number((sponsoredItems / totalFeedItems).toFixed(4));

  const injectionRatio =
    totalFeedItems === 0 ? 0 : Number((injectedAds / totalFeedItems).toFixed(4));

  const eligibilityRatio =
    injectedAds === 0 ? 0 : Number((eligibleAds / injectedAds).toFixed(4));

  const healthy =
    totalFeedItems > 0 &&
    sponsoredItems >= injectedAds &&
    eligibleAds <= injectedAds &&
    injectedAds <= 3;

  return {
    totalFeedItems,
    sponsoredItems,
    injectedAds,
    eligibleAds,
    sponsoredRatio,
    injectionRatio,
    eligibilityRatio,
    healthy,
  };
}
