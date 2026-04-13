export type VersusCardTelemetryEvent =
  | "versus_impression"
  | "versus_vote"
  | "versus_comment"
  | "versus_share"
  | "versus_hide"
  | "versus_dismiss"
  | "versus_result_resolved";

export type VersusCardTelemetryRecord = {
  cardId: string;
  event: VersusCardTelemetryEvent;
  userId?: string;
  optionId?: string;
  region?: string;
  language?: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildVersusCardTelemetryRecord(
  input: VersusCardTelemetryRecord
): VersusCardTelemetryRecord {
  return {
    ...input,
    cardId: input.cardId.trim(),
    userId: input.userId?.trim(),
    optionId: input.optionId?.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getVersusCardTelemetryKey(
  record: VersusCardTelemetryRecord
): string {
  return [
    record.cardId,
    record.event,
    record.userId || "anon",
    record.optionId || "none",
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
