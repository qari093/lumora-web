import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 09 — AI Layer Lock", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps source attribution for feed intelligence", () => {
    expect(src).toContain("source");
    expect(src).toContain('data-source={source}');
    expect(src).toContain("lumora_genesis_fyp_v1");
  });

  it("keeps mood/lane signal available for NEXA learning", () => {
    expect(src).toContain("lane");
    expect(src).toContain("Wonder");
    expect(src).toContain("item.lane");
  });

  it("keeps title signal available for interest mapping", () => {
    expect(src).toContain("title");
    expect(src).toContain("item.title");
    expect(src).toContain("Nebula");
  });

  it("keeps AI layer silent and non-intrusive", () => {
    expect(src).not.toContain("public likes");
    expect(src).not.toContain("followers");
    expect(src).not.toContain("viral rank");
  });
});
