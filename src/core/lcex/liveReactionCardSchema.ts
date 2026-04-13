export type LiveReactionCardSchema = {
  id: string;
  type: "live-reaction";
  entityId: string;
  title: string;
  subtitle?: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  roomId: string;
  liveCount: number;
  heatScore: number;
  startedAt: string;
  expiresAt?: string;
  region?: string;
  language?: string;
};

export function createLiveReactionCard(
  input: Omit<LiveReactionCardSchema, "type">
): LiveReactionCardSchema {
  return {
    ...input,
    type: "live-reaction",
  };
}

export function isLiveReactionActive(card: LiveReactionCardSchema): boolean {
  if (!card.expiresAt) return true;
  return Date.parse(card.expiresAt) > Date.now();
}
