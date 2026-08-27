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
    const playbackLane: FypRuntimeTrackingEvent["playbackLane"] =
      event.lane === "official_embed" ? "official_embed" : "native_video";

    return {
      id: event.id,
      cardId: event.cardId,
      sourceId: event.cardId,
      playbackLane,
      traceLane: event.lane?.trim() || "runtime_learning",
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

  if (realEvents.length >= 3) {
    return realEvents;
  }

  const seen = new Set(realEvents.map((event) => event.id));

  return [
    ...realEvents,
    ...fallback.filter((event) => !seen.has(event.id))
  ].slice(0, Math.max(3, fallback.length));
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
