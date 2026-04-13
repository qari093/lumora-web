import { describe, expect, it } from "vitest";
import { enqueueNotification, dequeueNotification, getQueueSize } from "@/lib/notifications/queue";

describe("notification delivery queue", () => {
  it("enqueues a notification", () => {
    const out = enqueueNotification("user_1", { msg: "hello" });
    expect(out.ok).toBe(true);
    expect(getQueueSize()).toBeGreaterThan(0);
  });

  it("dequeues a notification", () => {
    enqueueNotification("user_2", { msg: "test" });
    const out = dequeueNotification();
    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.item.delivered).toBe(true);
    }
  });

  it("handles empty queue", () => {
    // drain queue
    let result;
    do {
      result = dequeueNotification();
    } while (result.ok);

    const out = dequeueNotification();
    expect(out).toEqual({ ok: false, reason: "queue_empty" });
  });

  it("rejects missing user", () => {
    const out = enqueueNotification("", { msg: "x" });
    expect(out).toEqual({ ok: false, reason: "missing_user_id" });
  });

  it("rejects missing payload", () => {
    const out = enqueueNotification("user_3", null);
    expect(out).toEqual({ ok: false, reason: "missing_payload" });
  });
});
