import type {
  ObservabilityEvent,
  ObservabilityLevel
} from "../types";

const LEVELS: ObservabilityLevel[] = [
  "info",
  "warn",
  "error"
];

export function validateObservabilityEvent(
  event: ObservabilityEvent
): boolean {
  return Boolean(
    event.id &&
      LEVELS.includes(event.level) &&
      event.message &&
      Number.isFinite(event.ts)
  );
}
