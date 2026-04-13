export type TrustFeedbackTelemetryEvent =
  | "trust_feedback_created"
  | "trust_feedback_scored"
  | "trust_feedback_escalated"
  | "trust_feedback_reviewed"
  | "trust_feedback_resolved"
  | "trust_feedback_dismissed"
  | "trust_feedback_summary_viewed";

export type TrustFeedbackTelemetryRecord = {
  feedbackId: string;
  event: TrustFeedbackTelemetryEvent;
  userId?: string;
  surface?:
    | "discovery"
    | "live-room"
    | "versus"
    | "prediction-pick"
    | "mood-board"
    | "fandom-badge"
    | "identity"
    | "habit";
  occurredAt: string;
  region?: string;
  language?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildTrustFeedbackTelemetryRecord(
  input: TrustFeedbackTelemetryRecord
): TrustFeedbackTelemetryRecord {
  return {
    ...input,
    feedbackId: input.feedbackId.trim(),
    userId: input.userId?.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getTrustFeedbackTelemetryKey(
  record: TrustFeedbackTelemetryRecord
): string {
  return [
    record.feedbackId,
    record.event,
    record.userId || "anon",
    record.surface || "unknown",
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
