import { describe, expect, it } from "vitest";
import { createCuriousSidePath } from "@/lib/discovery/curiousSidePath";
import { createUnexpectedGift } from "@/lib/personalization/unexpectedGift";

describe("discovery personalization", () => {
  it("creates pressure-free side path and unexpected gift", () => {
    const sidePath = createCuriousSidePath({
      currentLane: "Cosmic Drift",
      watchedLanes: ["Cosmic Drift"],
      intensity: 5
    });

    const gift = createUnexpectedGift({
      preferredLane: "Silent Wonder",
      replayDepth: 4
    });

    expect(sidePath.safeDivergence).toBe(true);
    expect(gift.pressureFree).toBe(true);
    expect(gift.confidence).toBeGreaterThan(0.5);
  });
});
