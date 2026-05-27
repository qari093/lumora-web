import { describe, expect, it } from "vitest";
import { bufferEvents, flushEvents } from "../../src/lib/native-fyp/runtime/eventsPipeline";
import { buildTelemetryPayload } from "../../src/lib/native-fyp/runtime/telemetry";
import { createSessionId } from "../../src/lib/native-fyp/runtime/session";

describe("native fyp pack 014", () => {
  it("buffers events", () => {
    const out = bufferEvents([], { type: "skip", id: "1" });
    expect(out.length).toBe(1);
  });

  it("flush resets", () => {
    const out = flushEvents([{ type: "skip", id: "1" } as any]);
    expect(out.length).toBe(0);
  });

  it("telemetry payload", () => {
    const p = buildTelemetryPayload([1,2,3]);
    expect(p.count).toBe(3);
  });

  it("session id", () => {
    const id = createSessionId();
    expect(id.startsWith("sess_")).toBe(true);
  });
});
