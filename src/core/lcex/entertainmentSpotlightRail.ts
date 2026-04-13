import type { BlendableCard } from "./fypSourceBlender";

export type EntertainmentSpotlightRail = {
  id: "entertainment-spotlight";
  title: string;
  active: boolean;
  cards: BlendableCard[];
};

export function buildEntertainmentSpotlightRail(
  cards: BlendableCard[]
): EntertainmentSpotlightRail {
  return {
    id: "entertainment-spotlight",
    title: "Entertainment Spotlight",
    active: true,
    cards: cards.slice(0, 12),
  };
}

export function getEntertainmentSpotlightCards(
  rail: EntertainmentSpotlightRail
): BlendableCard[] {
  return rail.cards;
}
