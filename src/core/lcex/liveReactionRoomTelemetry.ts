export type LiveReactionRoomTelemetryEvent =
  | "room_created"
  | "room_started"
  | "room_joined"
  | "room_left"
  | "message_sent"
  | "reaction_sent"
  | "room_paused"
  | "room_resumed"
  | "room_closed";

export type LiveReactionRoomTelemetryRecord = {
  roomId: string;
  entityId: string;
  event: LiveReactionRoomTelemetryEvent;
  userId?: string;
  region?: string;
  language?: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildLiveReactionRoomTelemetryRecord(
  input: LiveReactionRoomTelemetryRecord
): LiveReactionRoomTelemetryRecord {
  return {
    ...input,
    roomId: input.roomId.trim(),
    entityId: input.entityId.trim(),
    userId: input.userId?.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getLiveReactionRoomTelemetryKey(
  record: LiveReactionRoomTelemetryRecord
): string {
  return [
    record.roomId,
    record.entityId,
    record.event,
    record.userId || "anon",
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
