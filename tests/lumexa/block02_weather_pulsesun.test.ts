import { describe, expect, it } from "vitest";

import { resolveEmotionalWeather } from "../../src/core/lumexa/weather/emotionalWeather";
import { resolvePulseSun, resolveWhisper } from "../../src/core/lumexa/pulse/pulseSun";

describe("Lumexa Weather + Pulse Sun", () => {
  it("resolves calm weather", () => {
    const weather = resolveEmotionalWeather({
      scrollSoftness: 0.9,
      pauseRhythm: 0.8,
      switchingVelocity: 0.1
    });

    expect(weather.mode).toBe("calm");
  });

  it("creates pulse sun state", () => {
    const sun = resolvePulseSun("calm");

    expect(sun.mode).toBe("calm");
    expect(sun.glow).toBeGreaterThan(0.5);
  });

  it("creates whispers", () => {
    expect(resolveWhisper(0).length).toBeGreaterThan(0);
  });
});
