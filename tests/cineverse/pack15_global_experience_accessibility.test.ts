import { describe, expect, it } from "vitest";
import {
  supportedAccessibility,
  buildCinemaPassport,
  supportsAccessibility,
  shouldUseLowBandwidthMode,
} from "../../src/cineverse/global/runtime";

describe("CineVerse Pack 15 — Global Experience + Accessibility", () => {
  it("supports accessibility systems", () => {
    expect(supportedAccessibility).toContain("subtitles");
    expect(supportsAccessibility("high-contrast")).toBe(true);
  });

  it("creates cinema passports", () => {
    const passport = buildCinemaPassport("Korean Cinema");

    expect(passport.unlocked).toBe(true);
    expect(passport.stampCount).toBeGreaterThan(0);
  });

  it("activates low-bandwidth mode", () => {
    expect(
      shouldUseLowBandwidthMode({
        connectionMbps: 2,
        saveData: false,
      })
    ).toBe(true);
  });
});
