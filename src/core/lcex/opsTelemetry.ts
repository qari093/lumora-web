export type OpsTelemetryEvent =
  | "ops_review_enqueued"
  | "ops_review_assigned"
  | "ops_review_reassigned"
  | "ops_review_resolved"
  | "ops_review_dismissed"
  | "ops_summary_viewed";

export type OpsTelemetryRecord = {
  reviewId: string;
  event: OpsTelemetryEvent;
  source?:
    | "trust-feedback"
    | "system-health"
    | "rights-gate"
    | "live-room"
    | "versus"
    | "prediction-pick"
    | "mood-board"
    | "identity"
    | "habit";
  reviewerId?: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildOpsTelemetryRecord(
  input: OpsTelemetryRecord
): OpsTelemetryRecord {
  return {
    ...input,
    reviewId: input.reviewId.trim(),
    reviewerId: input.reviewerId?.trim(),
  };
}

export function getOpsTelemetryKey(
  record: OpsTelemetryRecord
): string {
  return [
    record.reviewId,
    record.event,
    record.source || "unknown",
    record.reviewerId || "none",
    record.occurredAt,
  ].join(":");
}
