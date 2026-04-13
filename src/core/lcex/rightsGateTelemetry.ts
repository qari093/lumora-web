export type RightsGateTelemetryEvent =
  | "rights_checked"
  | "rights_allowed"
  | "rights_downgraded"
  | "rights_blocked"
  | "rights_manual_review";

export type RightsGateTelemetryRecord = {
  sourceId: string;
  entityId?: string;
  event: RightsGateTelemetryEvent;
  state:
    | "safe-display"
    | "safe-embed"
    | "metadata-only"
    | "thumbnail-only"
    | "blocked"
    | "manual-review";
  region?: string;
  occurredAt: string;
};

export function buildRightsGateTelemetryRecord(
  input: RightsGateTelemetryRecord
): RightsGateTelemetryRecord {
  return {
    ...input,
    sourceId: input.sourceId.trim(),
    entityId: input.entityId?.trim(),
    region: input.region?.trim().toLowerCase(),
  };
}

export function getRightsGateTelemetryKey(
  record: RightsGateTelemetryRecord
): string {
  return [
    record.sourceId,
    record.entityId || "none",
    record.event,
    record.state,
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
