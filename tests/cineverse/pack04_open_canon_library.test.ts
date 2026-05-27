import { describe, expect, it } from "vitest";
import {
  openCanonSeedFilms,
  validateOpenCanonFilm,
} from "../../src/cineverse/open-canon/library";

describe("CineVerse Pack 04 — Open Canon Library", () => {
  it("seeds the Open Canon", () => {
    expect(openCanonSeedFilms.length).toBeGreaterThanOrEqual(3);
  });

  it("validates seeded films", () => {
    expect(openCanonSeedFilms.every(validateOpenCanonFilm)).toBe(true);
  });
});
