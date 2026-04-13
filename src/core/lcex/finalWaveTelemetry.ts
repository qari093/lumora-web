export type FinalWaveTelemetryEvent =
  | "final_wave_registered"
  | "final_wave_scored"
  | "final_wave_blocked"
  | "final_wave_summary_viewed"
  | "final_wave_progress_confirmed";

export type FinalWaveTelemetryRecord = {
  progressId: string;
  event: FinalWaveTelemetryEvent;
  scope?:
    | "master-seal"
    | "final-wave"
    | "launch-corridor"
    | "closeout"
    | "verification";
  actorId?: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildFinalWaveTelemetryRecord(
  input: FinalWaveTelemetryRecord
): FinalWaveTelemetryRecord {
  return {
    ...input,
    progressId: input.progressId.trim(),
    actorId: input.actorId?.trim(),
  };
}

export function getFinalWaveTelemetryKey(
  record: FinalWaveTelemetryRecord
): string {
  return [
    record.progressId,
    record.event,
    record.scope || "unknown",
    record.actorId || "system",
    record.occurredAt,
  ].join(":");
}
