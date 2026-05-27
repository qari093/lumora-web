import { describe, expect, it } from "vitest";
import { civilizationSystems, civilizationHealthy } from "../../src/echo/atlas/civilizations";
import { atlasWeather } from "../../src/echo/atlas/weather";
import { resonanceSignals } from "../../src/echo/atlas/resonance";
import { sharedAuraRooms } from "../../src/echo/atlas/sharedRooms";

describe("Echo Pack 08 — Atlas + Civilizations", () => {
  it("supports civilizations", () => {
    expect(civilizationSystems).toContain("territories");
    expect(civilizationHealthy()).toBe(true);
  });

  it("supports emotional weather", () => {
    expect(atlasWeather().active).toBe(true);
  });

  it("supports resonance and aura rooms", () => {
    expect(resonanceSignals().community).toBe(true);
    expect(sharedAuraRooms().synchronized).toBe(true);
  });
});
