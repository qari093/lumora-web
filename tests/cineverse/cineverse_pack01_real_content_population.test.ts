import { describe, expect, it } from "vitest";
import {
  contentPopulationSystems,
  validateFilmSource,
  buildCanonSeal,
} from "../../src/cineverse/content/runtime";

describe("CineVerse Runtime Pack 1 — Real Content Population", () => {
  it("supports content systems", () => {
    expect(contentPopulationSystems).toContain("global-source-registry");
  });

  it("validates film sources", () => {
    expect(validateFilmSource({ verified: true, embeddable: true })).toBe(true);
  });

  it("creates canon seal", () => {
    expect(buildCanonSeal().status).toBe("sealed");
  });
});
