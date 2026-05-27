import { describe, expect, it } from "vitest";
import {
  validateCreatorHubBrowser,
  validateCreatorRuntime,
  validateDashboardZones
} from "@/src/core/creator-alchemy/validation";

describe("Phase 01 — Real Creator Hub Validation Ω", () => {
  it("validates browser safety", () => {
    const result = validateCreatorHubBrowser({
      mobileSafe: true,
      tabletSafe: true,
      desktopSafe: true,
      bottomTextVisible: true,
      atmosphereReadable: true,
      reducedMotionSafe: true,
      accessibilitySafe: true,
      gesturesSafe: true
    });

    expect(result.ok).toBe(true);
  });

  it("validates runtime signals", () => {
    const runtime = validateCreatorRuntime({
      watchTime: 120,
      rewatches: 8,
      quietReturns: 12,
      resonance: 0.8
    });

    expect(runtime.ok).toBe(true);
    expect(runtime.whisperSafe).toBe(true);
  });

  it("validates breathing dashboard zones", () => {
    expect(
      validateDashboardZones([
        "atmosphere_bar",
        "living_seed",
        "whisper_panel",
        "constellation_river",
        "quiet_impact_corner"
      ])
    ).toBe(true);
  });
});
