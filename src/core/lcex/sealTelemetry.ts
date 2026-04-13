export type SealTelemetryEvent =
  | "seal_registered"
  | "seal_granted"
  | "seal_revoked"
  | "seal_summary_viewed"
  | "seal_confirmed";

export type SealTelemetryRecord = {
  sealId: string;
  event: SealTelemetryEvent;
  scope?:
    | "group-a"
    | "group-b"
    | "group-c"
    | "group-d"
    | "group-e"
    | "group-f"
    | "canonical-closeout"
    | "launch";
  actorId?: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildSealTelemetryRecord(
  input: SealTelemetryRecord
): SealTelemetryRecord {
  return {
    ...input,
    sealId: input.sealId.trim(),
    actorId: input.actorId?.trim(),
  };
}

export function getSealTelemetryKey(
  record: SealTelemetryRecord
): string {
  return [
    record.sealId,
    record.event,
    record.scope || "unknown",
    record.actorId || "system",
    record.occurredAt,
  ].join(":");
}
