export const creatorShareLaunchGates = {
  creatorSignup: true,
  fanSignup: true,
  creatorHubLive: true,
  paymentsLive: true,
  webhooksLive: true,
  uploadsLive: true,
  inboxLive: true,
  saveThisMomentLive: true,
  shareLinksLive: true,
  digestEmailReady: true,
  abuseProtectionReady: true,
  supportFlowReady: true,
  analyticsReady: true,
  rollbackReady: true,
};

export function canLaunchCreatorShare() {
  return Object.values(creatorShareLaunchGates).every(Boolean);
}
