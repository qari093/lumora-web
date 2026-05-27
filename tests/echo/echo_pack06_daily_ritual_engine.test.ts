import { describe, expect, it } from "vitest";
import { emotionalWeatherForecast } from "../../src/echo/rituals/emotionalWeather";
import { morningBridgeRuntime } from "../../src/echo/rituals/morningBridge";
import { nightWindDown } from "../../src/echo/rituals/nightWindDown";
import { gentleFadeCurfew } from "../../src/echo/rituals/gentleFade";

describe("Echo Pack 06 — Daily Ritual Engine", () => {
  it("supports emotional weather", () => {
    expect(emotionalWeatherForecast().mood).toBe("softly hopeful");
  });

  it("supports Morning Bridge", () => {
    expect(morningBridgeRuntime().active).toBe(true);
  });

  it("supports Night Wind-Down and curfew", () => {
    expect(nightWindDown().calming).toBe(true);
    expect(gentleFadeCurfew().enabled).toBe(true);
  });
});
