import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 02 — Lumora Identity Layer", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");
  const identity = fs.readFileSync("src/components/fyp/FypOmegaIdentity.tsx", "utf8");

  it("uses the canonical FypOmegaIdentity component", () => {
    expect(src).toContain('FypOmegaIdentity');
    expect(src).toContain('lane={lane}');
    expect(src).toContain('count="1/10"');
  });

  it("keeps LUMORA top identity primitives", () => {
    expect(identity).toContain("LUMORA");
    expect(identity).toContain("lane");
    expect(identity).toContain("count");
  });

  it("keeps final top-bar meaning stable", () => {
    expect(src).toContain(': "Wonder"');
    expect(src).toContain('count="1/10"');
  });
});
