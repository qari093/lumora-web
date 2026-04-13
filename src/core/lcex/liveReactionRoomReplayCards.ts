export type LiveReactionRoomReplayCardInput = {
  roomId: string;
  entityId: string;
  title: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  replayMoments: string[];
  peakLiveCount: number;
  endedAt: string;
};

export type LiveReactionRoomReplayCard = {
  id: string;
  type: "live-reaction-replay";
  roomId: string;
  entityId: string;
  title: string;
  subtitle: string;
  replayMoments: string[];
  peakLiveCount: number;
  category: LiveReactionRoomReplayCardInput["category"];
  endedAt: string;
};

export function buildLiveReactionRoomReplayCard(
  input: LiveReactionRoomReplayCardInput
): LiveReactionRoomReplayCard {
  return {
    id: `live-reaction-replay:${input.roomId}`,
    type: "live-reaction-replay",
    roomId: input.roomId.trim(),
    entityId: input.entityId.trim(),
    title: input.title.trim(),
    subtitle: `Replay the biggest live moments • peak ${Math.max(0, Math.round(input.peakLiveCount))}`,
    replayMoments: input.replayMoments.map((m) => m.trim()).filter(Boolean).slice(0, 6),
    peakLiveCount: Math.max(0, Math.round(input.peakLiveCount)),
    category: input.category,
    endedAt: input.endedAt,
  };
}

export function isLiveReactionRoomReplayCardUsable(
  card: LiveReactionRoomReplayCard
): boolean {
  return (
    card.roomId.length > 0 &&
    card.entityId.length > 0 &&
    card.title.length > 0 &&
    card.replayMoments.length > 0
  );
}
