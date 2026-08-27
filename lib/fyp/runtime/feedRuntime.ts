export type FypRuntimeCard = {
  id: string;
  type: "seed" | "peak" | "portal" | "daily-drop" | "side-path";
  lane: string;
  title: string;
  playable: boolean;
};

export function createFypRuntimeFeed(cards: FypRuntimeCard[] = []): FypRuntimeCard[] {
  const base = cards.length
    ? cards
    : [
        { id: "daily-drop", type: "daily-drop" as const, lane: "silent-wonder", title: "Daily Emotional Drop", playable: true },
        { id: "peak-card", type: "peak" as const, lane: "cosmic-drift", title: "Peak Card", playable: true },
        { id: "atmospheric-portal", type: "portal" as const, lane: "midnight-cinema", title: "Atmospheric Portal", playable: true },
        { id: "curious-side-path", type: "side-path" as const, lane: "analog-memory", title: "Curious Side-Path", playable: true }
      ];

  return base.filter((card) => card.playable);
}

export function validateFypRuntime(): boolean {
  const feed = createFypRuntimeFeed();
  return feed.length >= 4 && feed.some((card) => card.type === "peak") && feed.some((card) => card.type === "portal");
}

export type FeedInput = {
  id: string;
  lane: string;
  emotion: string;
  score: number;
};

export function buildFeed(items: FeedInput[]): FeedInput[] {
  return [...items].sort((a, b) => b.score - a.score);
}
