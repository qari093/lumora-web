import { describe, expect, it } from "vitest";
import { worldEventsHealthy } from "../../../src/core/gmar/world-events/runtime";

describe("GMAR Pack 24 — Dynamic World Events", () => {
  it("validates world events", () => {
    const runtime = worldEventsHealthy();

    expect(runtime.liveWorldEvents).toBe(true);
    expect(runtime.civilizationMutation).toBe(true);
    expect(runtime.noForcedAttendance).toBe(true);
  });
});
