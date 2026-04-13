import type { SafeSeedRegistryEntry } from "./safeSeedRegistry";

export type SeedTelemetryEvent =
  | "seed_impression"
  | "seed_click"
  | "seed_hide"
  | "seed_save"
  | "seed_watchlist";

export type SeedTelemetryRecord = {
  seedId: string;
  event: SeedTelemetryEvent;
  sessionId: string;
  occurredAt: string;
  region?: string;
  language?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildSeedTelemetryRecord(
  seed: SafeSeedRegistryEntry,
  input: Omit<SeedTelemetryRecord, "seedId">
): SeedTelemetryRecord {
  return {
    seedId: seed.id,
    ...input,
  };
}

export function getSeedTelemetryKey(record: SeedTelemetryRecord): string {
  return [
    record.seedId,
    record.event,
    record.sessionId,
    record.occurredAt,
  ].join(":");
}
