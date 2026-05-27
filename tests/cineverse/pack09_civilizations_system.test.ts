import { describe, expect, it } from "vitest";
import {
  canPost,
  civilizationTiers,
  createCivilization,
} from "../../src/cineverse/civilizations/runtime";

describe("CineVerse Pack 09 — Civilizations System", () => {
  it("creates civilizations", () => {
    expect(createCivilization("Quiet Ache").alive).toBe(true);
  });

  it("protects civilization quality", () => {
    expect(civilizationTiers).toContain("elder");
    expect(canPost("witness")).toBe(false);
    expect(canPost("initiate")).toBe(true);
  });
});
