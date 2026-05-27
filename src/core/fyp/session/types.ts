export type SessionState =
  | "idle"
  | "active"
  | "paused"
  | "ended";

export type SessionEvent = {
  sessionId: string;
  userId: string;
  type: "start" | "heartbeat" | "pause" | "end";
  ts: number;
};

export type SessionSnapshot = {
  sessionId: string;
  userId: string;
  state: SessionState;
  durationMs: number;
  events: number;
};
