export type FeedItem = {
  id: string;
  type: "signal" | "trailer" | "fallback";
  score: number;
};

export function assembleFeed(): FeedItem[] {
  return [
    { id: "signal_001", type: "signal", score: 0.91 },
    { id: "trailer_001", type: "trailer", score: 0.88 },
    { id: "fallback_001", type: "fallback", score: 0.42 },
  ];
}
