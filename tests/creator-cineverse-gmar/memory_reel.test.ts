import { describe, expect, it } from "vitest";
import { createAutoMemoryReel } from "@/lib/gmar/autoMemoryReel";

describe("memory reel", () => {
  it("creates emotional replay reel", () => {
    const reel = createAutoMemoryReel("player-1");

    expect(reel.durationSeconds).toBe(30);
    expect(reel.moments.length).toBeGreaterThan(1);
  });
});
