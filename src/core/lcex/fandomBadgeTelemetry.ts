export type FandomBadgeTelemetryEvent =
  | "fandom_badge_viewed"
  | "fandom_badge_progress_updated"
  | "fandom_badge_awarded"
  | "fandom_badge_cooldown_started"
  | "fandom_badge_cooldown_ended"
  | "fandom_badge_hidden"
  | "fandom_badge_shared";

export type FandomBadgeTelemetryRecord = {
  badgeId: string;
  event: FandomBadgeTelemetryEvent;
  userId?: string;
  occurredAt: string;
  region?: string;
  language?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildFandomBadgeTelemetryRecord(
  input: FandomBadgeTelemetryRecord
): FandomBadgeTelemetryRecord {
  return {
    ...input,
    badgeId: input.badgeId.trim(),
    userId: input.userId?.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getFandomBadgeTelemetryKey(
  record: FandomBadgeTelemetryRecord
): string {
  return [
    record.badgeId,
    record.event,
    record.userId || "anon",
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
