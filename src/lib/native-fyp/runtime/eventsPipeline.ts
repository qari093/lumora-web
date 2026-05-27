import type { FypEvent } from "../behavior/events";

export function bufferEvents(events: FypEvent[], incoming: FypEvent): FypEvent[] {
  return [...events, incoming];
}

export function flushEvents(events: FypEvent[]): FypEvent[] {
  return [];
}
