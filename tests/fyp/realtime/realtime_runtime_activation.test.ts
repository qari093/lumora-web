import { describe, expect, it } from "vitest";

import { isRealtimeEventType, validateRealtimeEvent } from "@/src/core/fyp/realtime/contracts/realtimeContract";
import { FypRealtimeQueue } from "@/src/core/fyp/realtime/runtime/realtimeQueue";
import { createRealtimeEnvelope } from "@/src/core/fyp/realtime/runtime/realtimeEnvelope";
import { createFypRealtimeRuntime } from "@/src/core/fyp/realtime/runtime/realtimeRuntime";
import type { RealtimeEvent } from "@/src/core/fyp/realtime/types";

const event: RealtimeEvent = {
  id: "evt_1",
  type: "feed:item_view",
  userId: "user_1",
  itemId: "item_1",
  ts: Date.now(),
  payload: {
    watchMs: 1200
  }
};

describe("Lumora FYP Realtime Runtime Activation", () => {
  it("validates event type", () => {
    expect(isRealtimeEventType("feed:item_view")).toBe(true);
    expect(isRealtimeEventType("bad:event")).toBe(false);
  });

  it("validates realtime event contract", () => {
    expect(validateRealtimeEvent(event)).toBe(true);
  });

  it("queues and flushes realtime events", () => {
    const queue = new FypRealtimeQueue();

    const state = queue.enqueue(event);
    expect(state.queued).toBe(1);

    const flushed = queue.flush();
    expect(flushed).toHaveLength(1);
    expect(queue.state().delivered).toBe(1);
  });

  it("creates realtime envelope", () => {
    const envelope = createRealtimeEnvelope(event);

    expect(envelope.ok).toBe(true);
    expect(envelope.channel).toBe("fyp");
  });

  it("publishes through realtime runtime", () => {
    const runtime = createFypRealtimeRuntime();

    const envelope = runtime.publish(event);

    expect(envelope.event.id).toBe("evt_1");
    expect(runtime.state().queued).toBe(1);
  });
});
