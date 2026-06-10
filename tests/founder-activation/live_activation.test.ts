import { describe, expect, it } from "vitest";
import {
  getLiveActivationSummary,
  liveActivationRooms
} from "../../src/core/founder-activation/liveActivation";

describe("Live founder activation", () => {
  it("provides visible live room surfaces", () => {
    expect(liveActivationRooms.length).toBeGreaterThanOrEqual(4);
    expect(liveActivationRooms.some((room) => room.mode === "pulse")).toBe(true);
    expect(liveActivationRooms.some((room) => room.mode === "signal")).toBe(true);
    expect(liveActivationRooms.some((room) => room.mode === "review")).toBe(true);
  });

  it("keeps live activation in safe founder-review mode", () => {
    const summary = getLiveActivationSummary();

    expect(summary.status).toBe("LIVE_ACTIVATED_FOR_FOUNDER_REVIEW");
    expect(summary.safeMode).toBe(true);
    expect(summary.publicBroadcastEnabled).toBe(false);
    expect(summary.testerInvitesBlocked).toBe(true);
    expect(summary.roomCount).toBeGreaterThanOrEqual(4);
  });
});
