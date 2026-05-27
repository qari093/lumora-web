export type LiveEconomyAction =
  | "aura_beam"
  | "pulse_participation"
  | "sync_multiplier"
  | "pulse_auction_bid"
  | "creator_resonance_reward";

export type LiveEconomyPolicy = {
  casinoLoopsAllowed: false;
  rageIncentivesAllowed: false;
  speculativeRelicsAllowed: false;
  whaleProtectionEnabled: true;
};
