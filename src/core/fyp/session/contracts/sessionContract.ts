import type {
  SessionEvent
} from "../types";

const VALID_TYPES = [
  "start",
  "heartbeat",
  "pause",
  "end"
];

export function validateSessionEvent(
  event: SessionEvent
): boolean {
  return Boolean(
    event.sessionId &&
    event.userId &&
    VALID_TYPES.includes(event.type) &&
    Number.isFinite(event.ts)
  );
}
