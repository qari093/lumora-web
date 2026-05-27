import type { LumoraEventEnvelope } from "./types";
import { assertLumoraEvent } from "./validator";

export interface InMemoryEventStore {
  append(event: LumoraEventEnvelope): void;
  list(): LumoraEventEnvelope[];
  byDomain(domain: string): LumoraEventEnvelope[];
  clear(): void;
}

export function createInMemoryEventStore(): InMemoryEventStore {
  const events: LumoraEventEnvelope[] = [];

  return {
    append(event) {
      assertLumoraEvent(event);
      if (!events.some((item) => item.eventId === event.eventId)) {
        events.push(event);
      }
    },
    list() {
      return [...events];
    },
    byDomain(domain) {
      return events.filter((event) => event.domain === domain);
    },
    clear() {
      events.length = 0;
    }
  };
}
