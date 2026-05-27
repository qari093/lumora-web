import { describe, expect, it } from "vitest";
import { findLiveRoom, getLiveRooms } from "../../src/live/runtime/liveRooms";

describe("Lumora Live Activation Pack 2", () => {
  it("provides default runtime rooms", () => {
    expect(getLiveRooms().length).toBeGreaterThanOrEqual(3);
    expect(findLiveRoom("presence-calm")?.kind).toBe("presence");
  });
});
