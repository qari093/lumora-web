export type LiveReactionRoomSummaryCardInput = {
  roomId: string;
  entityId: string;
  title: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  peakLiveCount: number;
  totalMessages: number;
  totalReactions: number;
  topMoments: string[];
  endedAt: string;
};

export type LiveReactionRoomSummaryCard = {
  id: string;
  type: "live-reaction-summary";
  roomId: string;
  entityId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  topMoments: string[];
  category: LiveReactionRoomSummaryCardInput["category"];
  endedAt: string;
};

export function buildLiveReactionRoomSummaryCard(
  input: LiveReactionRoomSummaryCardInput
): LiveReactionRoomSummaryCard {
  return {
    id: `live-reaction-summary:${input.roomId}`,
    type: "live-reaction-summary",
    roomId: input.roomId.trim(),
    entityId: input.entityId.trim(),
    title: input.title.trim(),
    subtitle: `Live reactions recap • peak ${Math.max(0, Math.round(input.peakLiveCount))}`,
    statsLine: `${Math.max(0, Math.round(input.totalMessages))} messages • ${Math.max(0, Math.round(input.totalReactions))} reactions`,
    topMoments: input.topMoments.map((m) => m.trim()).filter(Boolean).slice(0, 5),
    category: input.category,
    endedAt: input.endedAt,
  };
}

export function isLiveReactionRoomSummaryCardUsable(
  card: LiveReactionRoomSummaryCard
): boolean {
  return (
    card.roomId.length > 0 &&
    card.entityId.length > 0 &&
    card.title.length > 0 &&
    card.statsLine.length > 0
  );
}
