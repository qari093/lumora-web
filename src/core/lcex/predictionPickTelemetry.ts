export type PredictionPickTelemetryEvent =
  | "prediction_pick_impression"
  | "prediction_pick_open"
  | "prediction_pick_vote"
  | "prediction_pick_comment"
  | "prediction_pick_share"
  | "prediction_pick_hide"
  | "prediction_pick_dismiss"
  | "prediction_pick_locked"
  | "prediction_pick_resolved";

export type PredictionPickTelemetryRecord = {
  pickId: string;
  event: PredictionPickTelemetryEvent;
  userId?: string;
  optionId?: string;
  region?: string;
  language?: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildPredictionPickTelemetryRecord(
  input: PredictionPickTelemetryRecord
): PredictionPickTelemetryRecord {
  return {
    ...input,
    pickId: input.pickId.trim(),
    userId: input.userId?.trim(),
    optionId: input.optionId?.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getPredictionPickTelemetryKey(
  record: PredictionPickTelemetryRecord
): string {
  return [
    record.pickId,
    record.event,
    record.userId || "anon",
    record.optionId || "none",
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
