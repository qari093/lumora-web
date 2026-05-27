import type { AnalyticsEvent } from "../types";

export function createSessionAnalyticsEvent(
  userId: string,
  sessionId: string
): AnalyticsEvent {
  return {
    id: `analytics_${sessionId}`,
    name: "session_start",
    userId,
    sessionId,
    ts: Date.now(),
    metadata: {
      source: "lumora-fyp"
    }
  };
}
