import { describe, expect, it } from "vitest";
import { createRoomConstellation } from "@/lib/live/roomConstellation";

describe("room constellation", () => {
  it("creates anonymous constellation", () => {
    const constellation = createRoomConstellation("room-1", 12);
    expect(constellation.roomId).toBe("room-1");
    expect(constellation.pattern).toBe("wave");
  });
});
