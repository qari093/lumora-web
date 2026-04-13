export type FallbackTelemetryEvent =
  | "fallback_rendered"
  | "fallback_clicked"
  | "fallback_dismissed"
  | "fallback_recovered";

export type FallbackTelemetryRecord = {
  fallbackId: string;
  fallbackKind:
    | "poster-only"
    | "title-release"
    | "watchlist-cta"
    | "discussion-cta"
    | "metadata-only";
  event: FallbackTelemetryEvent;
  sessionId: string;
  occurredAt: string;
  region?: string;
  language?: string;
};

export function buildFallbackTelemetryRecord(
  input: FallbackTelemetryRecord
): FallbackTelemetryRecord {
  return {
    ...input,
    fallbackId: input.fallbackId.trim(),
    sessionId: input.sessionId.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getFallbackTelemetryKey(
  record: FallbackTelemetryRecord
): string {
  return [
    record.fallbackId,
    record.fallbackKind,
    record.event,
    record.sessionId,
    record.occurredAt,
  ].join(":");
}
