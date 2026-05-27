import { describe, expect, it } from "vitest";
import {
  buildAtmosphereState,
  buildMotionPolicy,
  buildOneNightSkyVisualState,
  buildSilentPulseState,
  getAtmospherePalette,
  validateAtmosphereUsability,
  validatePaletteAccessibility
} from "@/src/core/creator-alchemy/atmosphere";

describe("Creator Alchemy Pack 09 — ZenAtmosphere Ω", () => {
  it("provides accessible atmosphere palettes", () => {
    const palette = getAtmospherePalette("reflective");
    expect(palette.mood).toBe("reflective");
    expect(validatePaletteAccessibility(palette)).toBe(true);
  });

  it("respects reduced and off motion policies", () => {
    expect(buildMotionPolicy("full").allowParallax).toBe(true);
    expect(buildMotionPolicy("reduced").allowParallax).toBe(false);
    expect(buildMotionPolicy("off").allowPulse).toBe(false);
  });

  it("builds atmosphere only when usability remains safe", () => {
    const state = buildAtmosphereState({
      mood: "quiet",
      intensity: "soft",
      motionMode: "reduced",
      navigationVisible: true,
      primaryActionVisible: true
    });

    expect(state.usabilitySafe).toBe(true);
    expect(state.motion.allowParallax).toBe(false);
  });

  it("keeps Silent Pulse rare, optional, and wordless", () => {
    const pulse = buildSilentPulseState({
      enabled: true,
      rareEnough: true,
      constellationActive: true
    });

    expect(pulse.visible).toBe(true);
    expect(pulse.words).toBe(false);
    expect(pulse.meaning).toBe("constellation_alive");
  });

  it("keeps One Night Sky optional and non-blocking", () => {
    const sky = buildOneNightSkyVisualState({
      userOptedIn: true,
      triggerStrength: 0.9,
      requestedMinutes: 20
    });

    expect(sky.active).toBe(true);
    expect(sky.optional).toBe(true);
    expect(sky.blocksNavigation).toBe(false);
    expect(sky.durationMinutes).toBe(10);
  });

  it("fails usability checks when atmosphere blocks clarity", () => {
    const check = validateAtmosphereUsability({
      navigationVisible: false,
      primaryActionVisible: true,
      textReadable: true,
      motionSafe: true,
      blocksContent: false
    });

    expect(check.ok).toBe(false);
    expect(check.reasons).toContain("navigation_hidden");
  });

  it("passes usability checks for calm atmosphere", () => {
    const check = validateAtmosphereUsability({
      navigationVisible: true,
      primaryActionVisible: true,
      textReadable: true,
      motionSafe: true,
      blocksContent: false
    });

    expect(check.ok).toBe(true);
  });
});
