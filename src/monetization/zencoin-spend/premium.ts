export type PremiumUnlock = "deep_insight" | "memory_replay" | "creator_theme";

export const PREMIUM_UNLOCK_COSTS: Record<PremiumUnlock, number> = {
  deep_insight: 25,
  memory_replay: 15,
  creator_theme: 30,
};

export function unlockPremiumFeature(input: {
  feature: PremiumUnlock;
  balance: number;
}) {
  const cost = PREMIUM_UNLOCK_COSTS[input.feature];

  return {
    feature: input.feature,
    unlocked: input.balance >= cost,
    cost,
    remaining: input.balance >= cost ? input.balance - cost : input.balance,
  };
}
