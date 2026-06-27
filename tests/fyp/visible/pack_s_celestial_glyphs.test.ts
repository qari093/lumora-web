import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack S — Celestial Glyphs Connected", () => {
  const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");
  const glyph = fs.readFileSync("src/components/fyp/CelestialGlyph.tsx", "utf8");

  it("connects CelestialGlyph into FYP player", () => {
    expect(player).toContain("CelestialGlyph");
    expect(player).not.toContain("TraceIcon");
  });

  it("provides all required glyph names", () => {
    expect(glyph).toContain('"deep"');
    expect(glyph).toContain('"board"');
    expect(glyph).toContain('"share"');
    expect(glyph).toContain('"space"');
    expect(glyph).toContain('"home"');
    expect(glyph).toContain('"flow"');
    expect(glyph).toContain('"live"');
    expect(glyph).toContain('"trace"');
  });
});
