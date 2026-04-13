export type MoodBoardTelemetryEvent =
  | "mood_board_created"
  | "mood_board_viewed"
  | "mood_board_refreshed"
  | "mood_board_shared"
  | "mood_board_saved"
  | "mood_board_hidden"
  | "mood_board_archived";

export type MoodBoardTelemetryRecord = {
  boardId: string;
  event: MoodBoardTelemetryEvent;
  userId?: string;
  occurredAt: string;
  region?: string;
  language?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildMoodBoardTelemetryRecord(
  input: MoodBoardTelemetryRecord
): MoodBoardTelemetryRecord {
  return {
    ...input,
    boardId: input.boardId.trim(),
    userId: input.userId?.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getMoodBoardTelemetryKey(
  record: MoodBoardTelemetryRecord
): string {
  return [
    record.boardId,
    record.event,
    record.userId || "anon",
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
