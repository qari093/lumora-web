export type RolloutGateTelemetryEvent =
  | "rollout_gate_created"
  | "rollout_gate_promoted"
  | "rollout_gate_paused"
  | "rollout_gate_resumed"
  | "rollout_gate_summary_viewed";

export type RolloutGateTelemetryRecord = {
  gateId: string;
  event: RolloutGateTelemetryEvent;
  scope?:
    | "discovery"
    | "identity"
    | "mood-board"
    | "fandom-badge"
    | "user-control"
    | "habit"
    | "trust"
    | "system-health"
    | "ops";
  occurredAt: string;
  actorId?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildRolloutGateTelemetryRecord(
  input: RolloutGateTelemetryRecord
): RolloutGateTelemetryRecord {
  return {
    ...input,
    gateId: input.gateId.trim(),
    actorId: input.actorId?.trim(),
  };
}

export function getRolloutGateTelemetryKey(
  record: RolloutGateTelemetryRecord
): string {
  return [
    record.gateId,
    record.event,
    record.scope || "unknown",
    record.actorId || "system",
    record.occurredAt,
  ].join(":");
}
