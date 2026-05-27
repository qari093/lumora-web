import type {
  ObservabilityEvent,
  ObservabilitySnapshot
} from "../types";

import {
  createObservabilityStore
} from "./observabilityStore";

export function runObservabilityRuntime(
  events: ObservabilityEvent[]
): ObservabilitySnapshot {
  const store = createObservabilityStore();

  for (const event of events) {
    store.push(event);
  }

  const stored = store.all();

  return {
    ok: true,
    total: stored.length,
    errors: stored.filter((event) => event.level === "error").length,
    warnings: stored.filter((event) => event.level === "warn").length
  };
}
