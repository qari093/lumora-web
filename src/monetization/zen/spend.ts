export type ZenSpendAction =
  | "content_boost"
  | "ai_enhancement"
  | "premium_unlock"
  | "ad_skip";

export const ZEN_SPEND_COSTS: Record<ZenSpendAction, number> = {
  content_boost: 20,
  ai_enhancement: 10,
  premium_unlock: 30,
  ad_skip: 5,
};

export function canSpendZen(input: {
  balance: number;
  action: ZenSpendAction;
}) {
  const cost = ZEN_SPEND_COSTS[input.action];

  return {
    ok: input.balance >= cost,
    cost,
    remaining: input.balance >= cost ? input.balance - cost : input.balance,
  };
}
