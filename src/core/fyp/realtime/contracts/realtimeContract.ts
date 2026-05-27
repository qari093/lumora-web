import type { RealtimeEvent, RealtimeEventType } from "../types";

const VALID_TYPES: RealtimeEventType[] = [
  "feed:item_view",
  "feed:item_like",
  "feed:item_share",
  "feed:session_ping"
];

export function isRealtimeEventType(value: string): value is RealtimeEventType {
  return VALID_TYPES.includes(value as RealtimeEventType);
}

export function validateRealtimeEvent(event: RealtimeEvent): boolean {
  return Boolean(
    event.id &&
      event.userId &&
      isRealtimeEventType(event.type) &&
      Number.isFinite(event.ts) &&
      event.ts > 0 &&
      event.payload &&
      typeof event.payload === "object"
  );
}
