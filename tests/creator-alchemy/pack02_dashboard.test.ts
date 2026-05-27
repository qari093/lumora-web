import { describe, expect, it } from "vitest";
import {
  SAMPLE_BREATHING_DASHBOARD_INPUT,
  buildBreathingDashboard,
  getAllowedWhisperCount,
  getDashboardZones,
  normalizeHorizonProgress,
  shouldShowAtmosphere
} from "@/src/core/creator-alchemy/dashboard";

describe("Creator Alchemy Pack 02 — Breathing Interface Dashboard Ω", () => {
  it("creates the starter dashboard without constellation overload", () => {
    const model = buildBreathingDashboard({
      ...SAMPLE_BREATHING_DASHBOARD_INPUT,
      stage: "starter"
    });

    expect(model.zones).not.toContain("constellation_river");
    expect(model.constellationOrbs).toHaveLength(0);
    expect(model.whisper?.text).toContain("0:42");
  });

  it("creates the resonance dashboard with constellation river", () => {
    const model = buildBreathingDashboard(SAMPLE_BREATHING_DASHBOARD_INPUT);

    expect(model.zones).toContain("constellation_river");
    expect(model.constellationOrbs.length).toBeGreaterThan(0);
    expect(model.quietImpact.horizonProgress).toBeGreaterThan(0);
  });

  it("keeps atmosphere scarce", () => {
    expect(shouldShowAtmosphere(0.7, 1)).toBe(true);
    expect(shouldShowAtmosphere(0.7, 4)).toBe(false);
    expect(shouldShowAtmosphere(0.2, 1)).toBe(false);
  });

  it("keeps whisper intensity restrained", () => {
    expect(getAllowedWhisperCount(false)).toBe(1);
    expect(getAllowedWhisperCount(true)).toBe(3);
  });

  it("normalizes horizon progress safely", () => {
    expect(normalizeHorizonProgress(-2)).toBe(0);
    expect(normalizeHorizonProgress(2)).toBe(1);
    expect(normalizeHorizonProgress(0.55)).toBe(0.55);
  });

  it("maps dashboard zones progressively", () => {
    expect(getDashboardZones("starter")).toContain("whisper_panel");
    expect(getDashboardZones("starter")).not.toContain("constellation_river");
    expect(getDashboardZones("resonance")).toContain("constellation_river");
    expect(getDashboardZones("mythic")).toContain("constellation_river");
  });
});
