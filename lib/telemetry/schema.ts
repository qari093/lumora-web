export type LumoraTelemetryEventType =
  | "mode_change"
  | "feed_impression"
  | "feed_click"
  | "duel_vote"
  | "duel_result"
  | "prediction_submit"
  | "challenge_submit"
  | "ad_impression"
  | "ad_click"
  | "portal_open"
  | "session_summary";

export type LumoraTelemetryEvent = {
  id: string;
  type: LumoraTelemetryEventType;
  sessionId?: string;
  userId?: string;
  mode?: "chill" | "focus" | "surge";
  portal?: string;
  targetId?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  ts: number;
};

export function createTelemetryEvent(
  input: Omit<LumoraTelemetryEvent, "id" | "ts">
): LumoraTelemetryEvent {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    ts: Date.now(),
    ...input,
  };
}
