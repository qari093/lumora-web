import { describe, expect, it } from "vitest";
import {
  oracleSuggest,
  validateOracleTone,
} from "../../src/cineverse/oracle/runtime";

describe("CineVerse Pack 10 — Oracle + Discovery", () => {
  it("returns cinematic discovery", () => {
    const result = oracleSuggest("rainy heartbreak");

    expect(result.films.length).toBe(3);
    expect(result.basedOnCommunityGenome).toBe(true);
  });

  it("avoids fake therapeutic tone", () => {
    expect(validateOracleTone("A quiet ache under distant rain.")).toBe(true);
    expect(validateOracleTone("I understand you and this is therapy.")).toBe(false);
  });
});
