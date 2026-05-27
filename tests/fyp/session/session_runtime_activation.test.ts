import { describe, expect, it } from "vitest";

import {
  validateSessionEvent
} from "@/src/core/fyp/session/contracts/sessionContract";

import {
  createSessionStore
} from "@/src/core/fyp/session/runtime/sessionStore";

import {
  createSessionSnapshot
} from "@/src/core/fyp/session/runtime/sessionSnapshot";

import {
  createSessionRuntime
} from "@/src/core/fyp/session/runtime/sessionRuntime";

const startTs = Date.now();

const event = {
  sessionId: "session_1",
  userId: "user_1",
  type: "start" as const,
  ts: startTs
};

describe("Lumora FYP Session Runtime Activation", () => {
  it("validates session event", () => {
    expect(
      validateSessionEvent(event)
    ).toBe(true);
  });

  it("stores session events", () => {
    const store =
      createSessionStore();

    store.push(event);

    expect(store.count()).toBe(1);
  });

  it("creates session snapshot", () => {
    const snapshot =
      createSessionSnapshot(
        "session_1",
        "user_1",
        [
          event,
          {
            ...event,
            type: "heartbeat",
            ts: startTs + 5000
          }
        ]
      );

    expect(snapshot.state).toBe("active");
    expect(snapshot.durationMs).toBe(5000);
  });

  it("tracks runtime session events", () => {
    const runtime =
      createSessionRuntime();

    runtime.track(event);

    const snapshot =
      runtime.snapshot(
        "session_1",
        "user_1"
      );

    expect(snapshot.events).toBe(1);
  });

  it("ends session correctly", () => {
    const snapshot =
      createSessionSnapshot(
        "session_1",
        "user_1",
        [
          event,
          {
            ...event,
            type: "end",
            ts: startTs + 10000
          }
        ]
      );

    expect(snapshot.state).toBe("ended");
  });
});
