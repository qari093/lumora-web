import { describe, expect, it } from "vitest";

import {
  validateObservabilityEvent
} from "@/src/core/fyp/observability/contracts/observabilityContract";

import {
  createObservabilityStore
} from "@/src/core/fyp/observability/runtime/observabilityStore";

import {
  runObservabilityRuntime
} from "@/src/core/fyp/observability/runtime/observabilityRuntime";

const events = [
  {
    id: "obs_001",
    level: "info" as const,
    message: "feed_runtime_started",
    ts: 1000
  },
  {
    id: "obs_002",
    level: "warn" as const,
    message: "feed_latency_high",
    ts: 1001
  },
  {
    id: "obs_003",
    level: "error" as const,
    message: "feed_runtime_error",
    ts: 1002
  }
];

describe("Lumora FYP Runtime Observability Activation", () => {
  it("validates observability event", () => {
    expect(validateObservabilityEvent(events[0])).toBe(true);
  });

  it("stores observability event", () => {
    const store = createObservabilityStore();

    expect(store.push(events[0])).toBe(1);
    expect(store.all()).toHaveLength(1);
  });

  it("rejects invalid observability event", () => {
    const store = createObservabilityStore();

    expect(() =>
      store.push({
        ...events[0],
        message: ""
      })
    ).toThrow("invalid_observability_event");
  });

  it("creates observability snapshot", () => {
    const snapshot = runObservabilityRuntime(events);

    expect(snapshot.total).toBe(3);
    expect(snapshot.errors).toBe(1);
    expect(snapshot.warnings).toBe(1);
  });

  it("runs observability runtime", () => {
    const snapshot = runObservabilityRuntime([events[0]]);

    expect(snapshot.ok).toBe(true);
    expect(snapshot.total).toBe(1);
  });
});
