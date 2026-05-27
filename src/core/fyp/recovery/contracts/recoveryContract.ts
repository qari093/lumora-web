import type {
  RecoveryEvent,
  RecoverySeverity
} from "../types";

const SEVERITIES: RecoverySeverity[] = [
  "soft",
  "hard",
  "fatal"
];

export function validateRecoveryEvent(
  event: RecoveryEvent
): boolean {
  return Boolean(
    event.id &&
      event.code &&
      SEVERITIES.includes(event.severity) &&
      typeof event.retryable === "boolean"
  );
}
