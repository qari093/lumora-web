import { describe, it, expect } from "vitest";
import { getSeedMovies, seedMoviesEnabled } from "@/lib/cineverse/seedMovies";

describe("CineVerse seed catalog", () => {
  it("has >= 100 movies when seed enabled", () => {
    if (!seedMoviesEnabled()) return;
    const items = getSeedMovies();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThanOrEqual(100);
  });
});
