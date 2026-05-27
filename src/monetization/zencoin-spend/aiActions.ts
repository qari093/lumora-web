export type AiSpendAction = "hero_image" | "holographic_effect" | "caption_polish";

export const AI_SPEND_COSTS: Record<AiSpendAction, number> = {
  hero_image: 10,
  holographic_effect: 15,
  caption_polish: 5,
};

export function createAiSpendAction(input: {
  action: AiSpendAction;
  balance: number;
}) {
  const cost = AI_SPEND_COSTS[input.action];

  return {
    action: input.action,
    cost,
    allowed: input.balance >= cost,
    remaining: input.balance >= cost ? input.balance - cost : input.balance,
  };
}
