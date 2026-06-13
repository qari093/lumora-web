import type { FypRuntimeTrackingEvent } from "@/src/core/fyp/runtime-tracking/fypRuntimeTracking";
import { readRecentFypEvents, type StoredFypEvent } from "@/src/core/fyp/runtime-tracking/fypEventStore";

const EVENT_MAP: Record<StoredFypEvent["event"], FypRuntimeTrackingEvent["type"]> = {
  impression: "impression",
  view: "view",
  watch_progress: "watch_progress",
  spark: "like",
  save: "save",
  deep_dive: "watch_progress",
  complete: "watch_progress",
  skip: "skip",
  share: "share"
};

export function convertStoredFypEventToTrackingEvent(event: StoredFypEvent): FypRuntimeTrackingEvent {
  return {
    id: event.id,
    cardId: event.cardId,
    type: EVENT_MAP[event.event],
    value: event.value,
    createdAt: new Date(event.ts).toISOString()
  };
}

export function readRealFypTrackingEvents(limit = 200): FypRuntimeTrackingEvent[] {
  return readRecentFypEvents(limit).map(convertStoredFypEventToTrackingEvent);
}

export function getFypLearningEventsWithFallback(fallback: FypRuntimeTrackingEvent[]): FypRuntimeTrackingEvent[] {
  const realEvents = readRealFypTrackingEvents(300);
  return realEvents.length > 0 ? realEvents : fallback;
}

export function validateRealEventLearningBridge(): boolean {
  const converted = convertStoredFypEventToTrackingEvent({
    id: "evt-test",
    cardId: "card-test",
    event: "save",
    value: 0.85,
    watchedMs: 12000,
    lane: "wonder",
    sessionId: "session-test",
    userId: "anonymous-user",
    ts: Date.now(),
    source: "fyp_tracking_v1"
  });

  return (
    converted.cardId === "card-test" &&
    converted.type === "save" &&
    converted.value === 0.85 &&
    typeof converted.createdAt === "string"
  );
}
