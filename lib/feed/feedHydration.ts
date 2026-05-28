export type FeedCard = {
  id: string;
  title: string;
  lane: string;
  playable: boolean;
  score: number;
};

export function hydrateFeed(cards: FeedCard[]): FeedCard[] {
  return [...cards]
    .filter((card) => card.playable)
    .sort((a, b) => b.score - a.score);
}
