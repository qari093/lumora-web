import { describe, expect, it } from "vitest";
import { createAfterglow } from "@/lib/afterglow/afterglowEngine";

describe("afterglow", () => {
  it("creates vault eligible live memory", () => {
    const item = createAfterglow("room-1");
    expect(item.vaultEligible).toBe(true);
    expect(item.roomId).toBe("room-1");
  });
});
