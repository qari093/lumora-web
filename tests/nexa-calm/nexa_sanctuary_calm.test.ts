import { describe, expect, it } from "vitest";
import { sanctuaryAtmosphere } from "@/src/core/nexa-calm/sanctuary/sanctuaryAtmosphere";
import { bodyWeather } from "@/src/core/nexa-calm/emotion/bodyWeather";
import { calmTrustBoundary } from "@/src/core/nexa-calm/trust/calmTrustBoundary";

describe("nexa sanctuary calm", () => {
  it("supports calm sanctuary", () => {
    expect(sanctuaryAtmosphere.calm).toBe(true);
  });

  it("resolves recovery weather", () => {
    expect(bodyWeather(0.9).mode).toBe("recovery");
  });

  it("prevents medical claims", () => {
    expect(calmTrustBoundary.noMedicalClaims).toBe(true);
  });
});
