export type ParticipationHabitTelemetryEvent =
  | "participation_habit_viewed"
  | "participation_habit_progressed"
  | "participation_habit_completed"
  | "participation_habit_rewarded"
  | "participation_habit_throttled"
  | "participation_habit_hidden"
  | "participation_habit_reset";

export type ParticipationHabitTelemetryRecord = {
  habitId: string;
  event: ParticipationHabitTelemetryEvent;
  userId?: string;
  occurredAt: string;
  region?: string;
  language?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildParticipationHabitTelemetryRecord(
  input: ParticipationHabitTelemetryRecord
): ParticipationHabitTelemetryRecord {
  return {
    ...input,
    habitId: input.habitId.trim(),
    userId: input.userId?.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getParticipationHabitTelemetryKey(
  record: ParticipationHabitTelemetryRecord
): string {
  return [
    record.habitId,
    record.event,
    record.userId || "anon",
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
