import type { BlendableCard } from "./fypSourceBlender";

export type GmarHighlightRail = {
  id: "gmar-highlight";
  title: string;
  active: boolean;
  cards: BlendableCard[];
};

export function buildGmarHighlightRail(
  cards: BlendableCard[]
): GmarHighlightRail {
  return {
    id: "gmar-highlight",
    title: "GMAR Highlights",
    active: true,
    cards: cards.slice(0, 10),
  };
}

export function getGmarHighlightCards(
  rail: GmarHighlightRail
): BlendableCard[] {
  return rail.cards;
}
