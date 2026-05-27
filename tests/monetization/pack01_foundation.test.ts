import { describe, expect, it } from "vitest";
import { validatePrinciples } from "@/src/monetization/config/principles";
import { classifyState } from "@/src/monetization/config/stateModel";
import { DEFAULT_CONFIG } from "@/src/monetization/config/schema";

describe("Monetization Pack01 — Foundation", () => {
  it("validates principles", () => {
    expect(validatePrinciples()).toBe(true);
  });

  it("classifies user states correctly", () => {
    expect(classifyState({ skipRate: 0.7, holdRate: 0.1, sessionDepth: 1 })).toBe("red");
    expect(classifyState({ skipRate: 0.2, holdRate: 0.6, sessionDepth: 5 })).toBe("green");
    expect(classifyState({ skipRate: 0.3, holdRate: 0.3, sessionDepth: 2 })).toBe("yellow");
  });

  it("has correct default config", () => {
    expect(DEFAULT_CONFIG.enabled).toBe(false);
    expect(DEFAULT_CONFIG.statePermissions.red.allowAds).toBe(false);
  });
});
