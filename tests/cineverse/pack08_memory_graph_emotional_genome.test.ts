import { describe, expect, it } from "vitest";
import {
  buildGenome,
  saveMoment,
} from "../../src/cineverse/memory/runtime";

describe("CineVerse Pack 08 — Memory Graph + Emotional Genome", () => {
  it("saves emotional moments", () => {
    expect(
      saveMoment({
        filmId: "film_1",
        emotion: "wonder",
      }).saved
    ).toBe(true);
  });

  it("builds emotional genome", () => {
    const genome = buildGenome(["longing", "grief"]);

    expect(genome.dominantEmotion).toBe("longing");
    expect(genome.emotionalDepth).toBe(2);
  });
});
