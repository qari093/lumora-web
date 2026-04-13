export type TrendBountyTelemetryEvent =
  | "bounty_impression"
  | "bounty_open"
  | "bounty_submission_started"
  | "bounty_submission_sent"
  | "bounty_review_assigned"
  | "bounty_winner_resolved"
  | "bounty_reward_released"
  | "bounty_hidden"
  | "bounty_dismissed";

export type TrendBountyTelemetryRecord = {
  bountyId: string;
  event: TrendBountyTelemetryEvent;
  userId?: string;
  submissionId?: string;
  region?: string;
  language?: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildTrendBountyTelemetryRecord(
  input: TrendBountyTelemetryRecord
): TrendBountyTelemetryRecord {
  return {
    ...input,
    bountyId: input.bountyId.trim(),
    userId: input.userId?.trim(),
    submissionId: input.submissionId?.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getTrendBountyTelemetryKey(
  record: TrendBountyTelemetryRecord
): string {
  return [
    record.bountyId,
    record.event,
    record.userId || "anon",
    record.submissionId || "none",
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
