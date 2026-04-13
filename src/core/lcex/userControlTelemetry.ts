export type UserControlTelemetryEvent =
  | "user_control_viewed"
  | "user_control_updated"
  | "user_control_blocked"
  | "user_control_reset"
  | "user_control_explainer_viewed"
  | "user_control_summary_viewed";

export type UserControlTelemetryRecord = {
  userId: string;
  event: UserControlTelemetryEvent;
  occurredAt: string;
  changedKeys?: string[];
  blockedKeys?: string[];
  safetyMode?: "normal" | "safe-filtered" | "interactive-disabled" | "suppressed";
  region?: string;
  language?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildUserControlTelemetryRecord(
  input: UserControlTelemetryRecord
): UserControlTelemetryRecord {
  return {
    ...input,
    userId: input.userId.trim(),
    changedKeys: input.changedKeys?.map((key) => key.trim()).filter(Boolean),
    blockedKeys: input.blockedKeys?.map((key) => key.trim()).filter(Boolean),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
  };
}

export function getUserControlTelemetryKey(
  record: UserControlTelemetryRecord
): string {
  return [
    record.userId,
    record.event,
    record.safetyMode || "none",
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
