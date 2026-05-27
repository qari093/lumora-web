import { describe, expect, it } from "vitest";
import {
  onboardingSystems,
  createUserJourney,
  supportsRetentionLoop,
} from "../../src/cineverse/onboarding/runtime";

describe("CineVerse Runtime Pack 5 — User Onboarding", () => {
  it("supports onboarding systems", () => {
    expect(onboardingSystems).toContain("first-watch-flow");
  });

  it("creates onboarding journey", () => {
    expect(createUserJourney().civilizationAssigned).toBe(true);
  });

  it("supports retention", () => {
    expect(supportsRetentionLoop()).toBe(true);
  });
});
