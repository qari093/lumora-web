export type LiveReactionRoomPostEventBridgeInput = {
  roomId: string;
  entityId: string;
  title: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  summaryLine: string;
  replayAvailable: boolean;
  highlightCount: number;
  endedAt: string;
};

export type LiveReactionRoomPostEventBridgeCard = {
  id: string;
  type: "live-reaction-post-event-bridge";
  roomId: string;
  entityId: string;
  title: string;
  subtitle: string;
  ctaLabel: "View Recap" | "Replay Highlights";
  category: LiveReactionRoomPostEventBridgeInput["category"];
  endedAt: string;
};

export function buildLiveReactionRoomPostEventBridge(
  input: LiveReactionRoomPostEventBridgeInput
): LiveReactionRoomPostEventBridgeCard {
  return {
    id: `live-reaction-post-event:${input.roomId}`,
    type: "live-reaction-post-event-bridge",
    roomId: input.roomId.trim(),
    entityId: input.entityId.trim(),
    title: input.title.trim(),
    subtitle: input.summaryLine.trim(),
    ctaLabel:
      input.replayAvailable || input.highlightCount > 0
        ? "Replay Highlights"
        : "View Recap",
    category: input.category,
    endedAt: input.endedAt,
  };
}

export function isLiveReactionRoomPostEventBridgeUsable(
  card: LiveReactionRoomPostEventBridgeCard
): boolean {
  return (
    card.roomId.length > 0 &&
    card.entityId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0
  );
}
