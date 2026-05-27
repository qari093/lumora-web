export const CREATOR_DASHBOARD_BOUNDARY = {
  module: "creator-dashboard",
  purpose: "Show creators quiet proof of being witnessed without converting human presence into vanity metrics.",
  owns: [
    "at-rest-state",
    "your-moment-card",
    "after-witness-state",
    "witness-thread",
    "memory-shelf",
    "witness-constellation",
    "future-ledger-drawer",
  ],
  forbidden: [
    "public-follower-count",
    "public-view-count",
    "creator-scoreboard",
    "backdoor-monetization-pressure",
  ],
} as const;

export function isCreatorDashboardFeature(feature: string): boolean {
  return CREATOR_DASHBOARD_BOUNDARY.owns.includes(feature as any);
}
