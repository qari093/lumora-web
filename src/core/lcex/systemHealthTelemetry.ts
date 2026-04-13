export type SystemHealthTelemetryEvent =
  | "system_health_signal_created"
  | "system_health_scored"
  | "system_health_escalated"
  | "system_health_recovery_started"
  | "system_health_recovered"
  | "system_health_summary_viewed";

export type SystemHealthTelemetryRecord = {
  signalId: string;
  event: SystemHealthTelemetryEvent;
  surface?:
    | "discovery"
    | "live-room"
    | "versus"
    | "prediction-pick"
    | "mood-board"
    | "fandom-badge"
    | "identity"
    | "habit"
    | "trust";
  occurredAt: string;
  region?: string;
  language?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildSystemHealthTelemetryRecord(
  input: SystemHealthTelemetryRecord
): SystemHealthTelemetryRecord {
  return {
    ...input,
    signalId: input.signalId.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getSystemHealthTelemetryKey(
  record: SystemHealthTelemetryRecord
): string {
  return [
    record.signalId,
    record.event,
    record.surface || "unknown",
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
