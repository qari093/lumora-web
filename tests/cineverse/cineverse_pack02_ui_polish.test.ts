import { describe, expect, it } from "vitest";
import {
  cinematicUiSystems,
  supportsReducedMotion,
  cinematicTheme,
} from "../../src/cineverse/ui/runtime";

describe("CineVerse Runtime Pack 2 — UI Polish", () => {
  it("supports cinematic systems", () => {
    expect(cinematicUiSystems).toContain("immersive-player");
  });

  it("supports accessibility", () => {
    expect(supportsReducedMotion(true)).toBe(true);
  });

  it("creates cinematic theme", () => {
    expect(cinematicTheme().atmosphere).toBe("cinematic");
  });
});
