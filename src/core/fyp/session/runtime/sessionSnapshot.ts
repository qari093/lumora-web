import type {
  SessionEvent,
  SessionSnapshot,
  SessionState
} from "../types";

export function createSessionSnapshot(
  sessionId: string,
  userId: string,
  events: SessionEvent[]
): SessionSnapshot {
  const first = events[0];
  const last = events[events.length - 1];

  let state: SessionState = "idle";

  if (last?.type === "start") {
    state = "active";
  } else if (last?.type === "heartbeat") {
    state = "active";
  } else if (last?.type === "pause") {
    state = "paused";
  } else if (last?.type === "end") {
    state = "ended";
  }

  return {
    sessionId,
    userId,
    state,
    durationMs:
      first && last
        ? Math.max(0, last.ts - first.ts)
        : 0,
    events: events.length
  };
}
