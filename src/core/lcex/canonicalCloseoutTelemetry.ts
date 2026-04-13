export type CanonicalCloseoutTelemetryEvent =
  | "canonical_closeout_registered"
  | "canonical_closeout_scored"
  | "canonical_closeout_blocked"
  | "canonical_closeout_summary_viewed"
  | "canonical_closeout_confirmed";

export type CanonicalCloseoutTelemetryRecord = {
  closeoutId: string;
  event: CanonicalCloseoutTelemetryEvent;
  scope?:
    | "contracts"
    | "guards"
    | "telemetry"
    | "summaries"
    | "locks"
    | "readiness"
    | "launch";
  actorId?: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildCanonicalCloseoutTelemetryRecord(
  input: CanonicalCloseoutTelemetryRecord
): CanonicalCloseoutTelemetryRecord {
  return {
    ...input,
    closeoutId: input.closeoutId.trim(),
    actorId: input.actorId?.trim(),
  };
}

export function getCanonicalCloseoutTelemetryKey(
  record: CanonicalCloseoutTelemetryRecord
): string {
  return [
    record.closeoutId,
    record.event,
    record.scope || "unknown",
    record.actorId || "system",
    record.occurredAt,
  ].join(":");
}
