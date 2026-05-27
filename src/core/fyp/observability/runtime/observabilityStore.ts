import type {
  ObservabilityEvent
} from "../types";

import {
  validateObservabilityEvent
} from "../contracts/observabilityContract";

export function createObservabilityStore() {
  const events: ObservabilityEvent[] = [];

  return {
    push(event: ObservabilityEvent) {
      if (!validateObservabilityEvent(event)) {
        throw new Error("invalid_observability_event");
      }

      events.push(event);
      return events.length;
    },

    all() {
      return [...events];
    }
  };
}
