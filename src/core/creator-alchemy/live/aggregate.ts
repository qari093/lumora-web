import type { CreatorAlchemyEvent, CreatorLiveAggregate } from "./types";
import { sanitizeCreatorAlchemyEvents } from "./eventValidation";

export function aggregateCreatorEvents(creatorId: string, events: readonly CreatorAlchemyEvent[]): CreatorLiveAggregate {
  const safeEvents = sanitizeCreatorAlchemyEvents(events).filter((event) => event.creatorId === creatorId);
  const timestampCounts = new Map<number, number>();

  for (const event of safeEvents) {
    if (typeof event.timestampSeconds === "number") {
      const bucket = Math.floor(event.timestampSeconds / 5) * 5;
      timestampCounts.set(bucket, (timestampCounts.get(bucket) ?? 0) + 1);
    }
  }

  const strongestTimestamp = [...timestampCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  return {
    creatorId,
    events: safeEvents,
    totalEvents: safeEvents.length,
    quietGiftCount: safeEvents.filter((event) => event.type === "quiet_gift").length,
    silentReturnCount: new Set(safeEvents.filter((event) => event.type === "rewatch").map((event) => event.viewerId)).size,
    strongestTimestamp
  };
}
