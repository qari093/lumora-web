import { describe, expect, it } from "vitest";
import {
  cineversePlatformRuntime,
  validateCineVersePlatformRuntime,
} from "../../src/cineverse/platform/runtime";

describe("CineVerse Pack 02 — Infrastructure Platform Core", () => {
  it("validates low-burn runtime", () => {
    expect(validateCineVersePlatformRuntime()).toBe(true);
  });

  it("does not assume central full-film hosting", () => {
    expect(cineversePlatformRuntime.externalVideoFirst).toBe(true);
  });
});
