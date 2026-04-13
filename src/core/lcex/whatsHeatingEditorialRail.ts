import type { BlendableCard } from "./fypSourceBlender";

export type WhatsHeatingEditorialRail = {
  id: "whats-heating-editorial";
  title: string;
  active: boolean;
  cards: BlendableCard[];
};

export function buildWhatsHeatingEditorialRail(
  cards: BlendableCard[]
): WhatsHeatingEditorialRail {
  return {
    id: "whats-heating-editorial",
    title: "What's Heating",
    active: true,
    cards: cards.slice(0, 10),
  };
}

export function getWhatsHeatingEditorialCards(
  rail: WhatsHeatingEditorialRail
): BlendableCard[] {
  return rail.cards;
}
