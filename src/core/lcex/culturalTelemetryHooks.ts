export type CulturalTelemetryEvent =
  | "culture_review_triggered"
  | "culture_demotion_applied"
  | "culture_suppression_applied"
  | "culture_region_locked"
  | "culture_override_applied";

export type CulturalTelemetryRecord = {
  entityId: string;
  event: CulturalTelemetryEvent;
  occurredAt: string;
  region?: string;
  language?: string;
  culturalScore?: number;
  sensitivityScore?: number;
  reason?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildCulturalTelemetryRecord(
  input: CulturalTelemetryRecord
): CulturalTelemetryRecord {
  return {
    ...input,
    entityId: input.entityId.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
    reason: input.reason?.trim(),
  };
}

export function getCulturalTelemetryKey(
  record: CulturalTelemetryRecord
): string {
  return [
    record.entityId,
    record.event,
    record.region || "global",
    record.language || "unknown",
    record.occurredAt,
  ].join(":");
}
