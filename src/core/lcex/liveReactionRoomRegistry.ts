export type LiveReactionRoomStatus =
  | "scheduled"
  | "live"
  | "cooldown"
  | "closed";

export type LiveReactionRoomCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media";

export type LiveReactionRoomRecord = {
  id: string;
  entityId: string;
  title: string;
  category: LiveReactionRoomCategory;
  region?: string;
  language?: string;
  status: LiveReactionRoomStatus;
  liveCount: number;
  heatScore: number;
  startedAt?: string;
  scheduledAt?: string;
  endedAt?: string;
};

export const LIVE_REACTION_ROOM_REGISTRY: LiveReactionRoomRecord[] = [];

export function registerLiveReactionRoom(
  room: LiveReactionRoomRecord
): void {
  LIVE_REACTION_ROOM_REGISTRY.push({
    ...room,
    id: room.id.trim(),
    entityId: room.entityId.trim(),
    title: room.title.trim(),
    region: room.region?.trim().toLowerCase(),
    language: room.language?.trim().toLowerCase(),
  });
}

export function getLiveReactionRoomById(
  id: string
): LiveReactionRoomRecord | undefined {
  const normalizedId = id.trim();
  return LIVE_REACTION_ROOM_REGISTRY.find((room) => room.id === normalizedId);
}

export function getActiveLiveReactionRooms(): LiveReactionRoomRecord[] {
  return LIVE_REACTION_ROOM_REGISTRY
    .filter((room) => room.status === "live" || room.status === "scheduled")
    .sort((a, b) => {
      const heatDelta = b.heatScore - a.heatScore;
      if (heatDelta !== 0) return heatDelta;
      return b.liveCount - a.liveCount;
    });
}
