export interface FeedCard {
  id: string;
  lane: string;
  emotion: string;
  score: number;
}

export function buildFeed(cards: FeedCard[]) {
  return cards
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}
