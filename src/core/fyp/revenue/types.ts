export type RevenueSource =
  | "echo_dividend"
  | "atmosphere_subscription"
  | "pulse_royalty"
  | "gut_check_payout"
  | "relic_license"
  | "rush_bonus"
  | "syndication_snippet";

export type CreatorRevenueEvent = {
  eventId: string;
  creatorId: string;
  source: RevenueSource;
  amount: number;
  referenceId: string;
  createdAt: number;
};

export type CreatorWallet = {
  creatorId: string;
  balance: number;
  pending: number;
  lifetimeEarned: number;
  eventCount: number;
};
