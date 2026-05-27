import { describe, expect, it } from "vitest";
import {
  cineverseCorePillars,
  validateCineVerseDoctrine,
} from "../../src/cineverse/core/doctrine";

describe("CineVerse Pack 01 — Foundational Core", () => {
  it("locks the foundational doctrine", () => {
    expect(validateCineVerseDoctrine()).toBe(true);
  });

  it("contains the required core pillars", () => {
    expect(cineverseCorePillars).toContain("video-federation");
    expect(cineverseCorePillars).toContain("cinematic-fyp");
    expect(cineverseCorePillars).toContain("rights-safety");
  });
});
