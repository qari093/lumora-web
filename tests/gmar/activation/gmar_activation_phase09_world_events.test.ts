import { createInitialGmarGameState } from "@/src/core/gmar/state/gameState";

import {
  GMAR_WORLD_ZONES,
  GMAR_LIVE_EVENTS,
  getGmarLiveEvent,
  joinGmarLiveEvent,
  assertGmarWorldEventState
} from "@/src/core/gmar/world-active/worldEvents";

describe("GMAR Activation Phase 09 — World + Events", () => {
  it("locks world zones and live event registry", () => {
    expect(GMAR_WORLD_ZONES.length).toBeGreaterThan(0);
    expect(GMAR_LIVE_EVENTS[0]?.eventId).toBe("origin_storm");
    expect(getGmarLiveEvent("origin_storm").active).toBe(true);
  });

  it("joins active live event", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    const updated = joinGmarLiveEvent({
      state,
      eventId: "origin_storm"
    });

    expect(updated.world.eventId).toBe("origin_storm");
    expect(updated.world.zoneId).toBe("arrival_gate");
    expect(assertGmarWorldEventState(updated)).toBe(true);
  });

  it("rejects missing event", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    expect(() =>
      joinGmarLiveEvent({
        state,
        eventId: "missing_event"
      })
    ).toThrow("GMAR live event not found.");
  });
});
