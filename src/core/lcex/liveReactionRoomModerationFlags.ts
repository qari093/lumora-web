export type LiveReactionRoomModerationFlagReason =
  | "spam"
  | "abuse"
  | "hate"
  | "harassment"
  | "rights_risk"
  | "cultural_risk"
  | "age_safety"
  | "other";

export type LiveReactionRoomModerationFlag = {
  id: string;
  roomId: string;
  entityId: string;
  reason: LiveReactionRoomModerationFlagReason;
  severity: 1 | 2 | 3 | 4 | 5;
  reportedAt: string;
  reporterId?: string;
  note?: string;
};

export function buildLiveReactionRoomModerationFlag(
  input: LiveReactionRoomModerationFlag
): LiveReactionRoomModerationFlag {
  return {
    ...input,
    id: input.id.trim(),
    roomId: input.roomId.trim(),
    entityId: input.entityId.trim(),
    reporterId: input.reporterId?.trim(),
    note: input.note?.trim(),
  };
}

export function isCriticalLiveReactionRoomModerationFlag(
  flag: LiveReactionRoomModerationFlag
): boolean {
  return flag.severity >= 4;
}

export function shouldEscalateLiveReactionRoomModerationFlag(
  flag: LiveReactionRoomModerationFlag
): boolean {
  return (
    isCriticalLiveReactionRoomModerationFlag(flag) ||
    flag.reason === "rights_risk" ||
    flag.reason === "cultural_risk" ||
    flag.reason === "age_safety"
  );
}
