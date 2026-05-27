import { describe, expect, it } from "vitest";
import { cineverseBridge } from "../../src/echo/bridges/cineverseBridge";
import { lumaSpaceBridge } from "../../src/echo/bridges/lumaspaceBridge";
import { gmarBridge } from "../../src/echo/bridges/gmarBridge";
import { synchronizedRituals } from "../../src/echo/bridges/liveSync";

describe("Echo Pack 15 — Cross Portal Bridge", () => {
  it("supports CineVerse bridge", () => {
    expect(cineverseBridge().connected).toBe(true);
  });

  it("supports LumaSpace and GMAR bridges", () => {
    expect(lumaSpaceBridge().atmosphereSync).toBe(true);
    expect(gmarBridge().liveEvents).toBe(true);
  });

  it("supports synchronized rituals", () => {
    expect(synchronizedRituals().synchronized).toBe(true);
  });
});
