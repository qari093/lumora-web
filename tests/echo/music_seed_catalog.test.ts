import { describe, it, expect } from "vitest";
import { getSeedTracks, seedTracksEnabled } from "@/lib/echo/seedTracks";

describe("Echo seed catalog", () => {
  it("has >= 200 tracks when seed enabled", () => {
    if (!seedTracksEnabled()) return;
    const items = getSeedTracks();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThanOrEqual(200);
  });
});
