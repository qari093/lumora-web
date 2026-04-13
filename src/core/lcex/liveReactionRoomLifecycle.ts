export type LiveReactionLifecycleStatus =
  | "scheduled"
  | "live"
  | "cooldown"
  | "closed";

export type LiveReactionLifecycleRecord = {
  id: string;
  entityId: string;
  status: LiveReactionLifecycleStatus;
  scheduledAt?: string;
  startedAt?: string;
  cooldownAt?: string;
  endedAt?: string;
};

export function startLiveReactionRoom(
  room: LiveReactionLifecycleRecord
): LiveReactionLifecycleRecord {
  return {
    ...room,
    status: "live",
    startedAt: room.startedAt ?? new Date().toISOString(),
  };
}

export function moveLiveReactionRoomToCooldown(
  room: LiveReactionLifecycleRecord
): LiveReactionLifecycleRecord {
  return {
    ...room,
    status: "cooldown",
    cooldownAt: new Date().toISOString(),
  };
}

export function closeLiveReactionRoom(
  room: LiveReactionLifecycleRecord
): LiveReactionLifecycleRecord {
  return {
    ...room,
    status: "closed",
    endedAt: new Date().toISOString(),
  };
}

export function isLiveReactionRoomActive(
  room: LiveReactionLifecycleRecord
): boolean {
  return room.status === "scheduled" || room.status === "live";
}
