export type IdentityPersonalizationTelemetryEvent =
  | "identity_profile_updated"
  | "identity_affinity_mapped"
  | "identity_vibe_tags_mapped"
  | "identity_intensity_changed"
  | "identity_opt_in_changed"
  | "identity_reason_viewed"
  | "identity_override_applied"
  | "identity_summary_viewed";

export type IdentityPersonalizationTelemetryRecord = {
  userId: string;
  event: IdentityPersonalizationTelemetryEvent;
  occurredAt: string;
  region?: string;
  language?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildIdentityPersonalizationTelemetryRecord(
  input: IdentityPersonalizationTelemetryRecord
): IdentityPersonalizationTelemetryRecord {
  return {
    ...input,
    userId: input.userId.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getIdentityPersonalizationTelemetryKey(
  record: IdentityPersonalizationTelemetryRecord
): string {
  return [
    record.userId,
    record.event,
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
