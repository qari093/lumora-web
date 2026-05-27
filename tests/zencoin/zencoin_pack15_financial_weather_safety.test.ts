import { describe, expect, it } from "vitest";
import {
  phraseIsLegalSafe,
  createWeatherPhrase,
  financialWeatherSafetyHealthy
} from "@/core/zencoin/weather/weatherSafety";

describe("Zencoin Pack 15 — Financial Weather Safety", () => {
  it("rejects clinical language", () => {
    expect(phraseIsLegalSafe("This supports anxiety healing")).toBe(false);
  });

  it("creates safe weather phrase", () => {
    expect(phraseIsLegalSafe(createWeatherPhrase())).toBe(true);
    expect(createWeatherPhrase()).toContain("world outside");
  });

  it("supports weather safety health", () => {
    expect(financialWeatherSafetyHealthy()).toBe(true);
  });
});
