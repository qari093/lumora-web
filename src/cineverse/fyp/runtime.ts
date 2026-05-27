import type { CineVerseFypCard } from "./types";

export function rankCineVerseFypCards(cards: CineVerseFypCard[]) {
  return [...cards].sort((a, b) => b.priority - a.priority);
}

export function shouldInjectEmotionalDiversity(input: {
  dominantEmotionPercent: number;
  consecutiveDays: number;
}) {
  return input.dominantEmotionPercent >= 80 && input.consecutiveDays >= 3;
}
