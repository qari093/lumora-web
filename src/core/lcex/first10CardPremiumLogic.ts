import type { BlendableCard } from "./fypSourceBlender";

export type PremiumFirst10Card = BlendableCard & {
  premiumPlacement: {
    index: number;
    premium: boolean;
    reason: "first10" | "standard";
  };
};

export function buildFirst10CardPremiumLogic(
  cards: BlendableCard[]
): PremiumFirst10Card[] {
  return cards.map((card, index) => ({
    ...card,
    premiumPlacement: {
      index,
      premium: index < 10,
      reason: index < 10 ? "first10" : "standard",
    },
  }));
}

export function getPremiumFirst10Cards(
  cards: BlendableCard[]
): PremiumFirst10Card[] {
  return buildFirst10CardPremiumLogic(cards).filter(
    (card) => card.premiumPlacement.premium
  );
}
