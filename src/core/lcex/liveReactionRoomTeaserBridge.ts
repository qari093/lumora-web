export type LiveReactionRoomTeaserBridgeInput = {
  roomId: string;
  entityId: string;
  teaserId?: string;
  teaserTitle: string;
  roomTitle: string;
  liveCount: number;
  heatScore: number;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
};

export type LiveReactionRoomTeaserBridgeOutput = {
  id: string;
  type: "live-reaction-bridge";
  roomId: string;
  entityId: string;
  teaserId?: string;
  title: string;
  subtitle: string;
  ctaLabel: "Join Live Reactions";
  liveCount: number;
  heatScore: number;
  category: LiveReactionRoomTeaserBridgeInput["category"];
};

export function buildLiveReactionRoomTeaserBridge(
  input: LiveReactionRoomTeaserBridgeInput
): LiveReactionRoomTeaserBridgeOutput {
  return {
    id: `live-reaction-bridge:${input.roomId}:${input.entityId}`,
    type: "live-reaction-bridge",
    roomId: input.roomId,
    entityId: input.entityId,
    teaserId: input.teaserId,
    title: input.teaserTitle.trim(),
    subtitle: `${input.roomTitle.trim()} • ${input.liveCount} live • heat ${Math.round(input.heatScore)}`,
    ctaLabel: "Join Live Reactions",
    liveCount: input.liveCount,
    heatScore: input.heatScore,
    category: input.category,
  };
}

export function canBridgeTeaserToLiveReactionRoom(
  input: LiveReactionRoomTeaserBridgeInput
): boolean {
  return (
    input.roomId.trim().length > 0 &&
    input.entityId.trim().length > 0 &&
    input.teaserTitle.trim().length > 0 &&
    input.roomTitle.trim().length > 0 &&
    input.liveCount >= 0 &&
    input.heatScore >= 0
  );
}
