import type { AnalyticsEvent, AnalyticsEventName } from "../types";

const VALID_EVENTS: AnalyticsEventName[] = [
  "video_impression",
  "video_view",
  "video_like",
  "video_share",
  "session_start"
];

export function isAnalyticsEventName(
  value: string
): value is AnalyticsEventName {
  return VALID_EVENTS.includes(value as AnalyticsEventName);
}

export function validateAnalyticsEvent(
  event: AnalyticsEvent
): boolean {
  return Boolean(
    event.id &&
      event.userId &&
      event.sessionId &&
      isAnalyticsEventName(event.name) &&
      Number.isFinite(event.ts) &&
      event.ts > 0 &&
      event.metadata &&
      typeof event.metadata === "object"
  );
}
