import { describe, expect, it } from "vitest";
import { sonicSeed, sonicIdentityReady } from "../../src/echo/sonic/sonicSeed";
import { startupResonance } from "../../src/echo/sonic/startupTone";
import { saveMemoryTone } from "../../src/echo/sonic/memoryTone";
import { emotionalWeatherCue } from "../../src/echo/sonic/weatherCue";

describe("Echo Pack 02 — Sonic Identity", () => {
  it("supports sonic seed", () => {
    expect(sonicSeed.startup).toBe("warm-rise");
    expect(sonicIdentityReady()).toBe(true);
  });

  it("supports startup resonance", () => {
    expect(startupResonance().active).toBe(true);
  });

  it("supports memory and weather cues", () => {
    expect(saveMemoryTone().emotional).toBe(true);
    expect(emotionalWeatherCue().mood).toBe("gentle");
  });
});
