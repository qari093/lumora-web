import { describe, expect, it } from "vitest";
import { calculateEmotionalWeather } from "../../src/live/atmosphere/emotionalWeatherCore";
import { createLullabyState } from "../../src/live/atmosphere/lullabyCore";
import { canSealDreamweaverCanvas } from "../../src/live/atmosphere/dreamweaverCore";

describe("Lumora Live Pack 12 — Atmosphere", () => {
  it("calculates dominant emotional weather", () => {
    expect(calculateEmotionalWeather({
      calm: 80,
      joy: 20,
      intensity: 10,
      heaviness: 5,
    })).toBe("calm");

    expect(calculateEmotionalWeather({
      calm: 10,
      joy: 15,
      intensity: 90,
      heaviness: 5,
    })).toBe("electric");
  });

  it("creates optional Lullaby wind-down state", () => {
    const lullaby = createLullabyState(true);
    expect(lullaby.enabled).toBe(true);
    expect(lullaby.durationSeconds).toBe(120);
  });

  it("seals Dreamweaver canvas only with enough contributors", () => {
    expect(canSealDreamweaverCanvas(4)).toBe(false);
    expect(canSealDreamweaverCanvas(5)).toBe(true);
  });
});
