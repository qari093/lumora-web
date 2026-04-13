export type FinalReadinessTelemetryEvent =
  | "final_readiness_registered"
  | "final_readiness_scored"
  | "final_blocker_detected"
  | "final_readiness_summary_viewed"
  | "launch_readiness_confirmed";

export type FinalReadinessTelemetryRecord = {
  readinessId: string;
  event: FinalReadinessTelemetryEvent;
  scope?:
    | "group-a"
    | "group-b"
    | "group-c"
    | "group-d"
    | "group-e"
    | "rollout"
    | "ops"
    | "health"
    | "launch";
  actorId?: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildFinalReadinessTelemetryRecord(
  input: FinalReadinessTelemetryRecord
): FinalReadinessTelemetryRecord {
  return {
    ...input,
    readinessId: input.readinessId.trim(),
    actorId: input.actorId?.trim(),
  };
}

export function getFinalReadinessTelemetryKey(
  record: FinalReadinessTelemetryRecord
): string {
  return [
    record.readinessId,
    record.event,
    record.scope || "unknown",
    record.actorId || "system",
    record.occurredAt,
  ].join(":");
}
