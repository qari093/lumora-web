import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack G — Identity Connected", () => {
  const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");
  const component = fs.readFileSync("src/components/fyp/FypOmegaIdentity.tsx", "utf8");
  const css = fs.readFileSync("src/components/fyp/FypOmegaIdentity.module.css", "utf8");

  it("connects identity component into FYP player", () => {
    expect(player).toContain("FypOmegaIdentity");
    expect(player).toContain('lane={lane}');
  });

  it("renders Lumora identity primitives", () => {
    expect(component).toContain("LUMORA");
    expect(component).toContain("✦");
    expect(component).toContain("count");
  });

  it("contains holographic blade and glass pill styling", () => {
    expect(css).toContain("linear-gradient");
    expect(css).toContain("backdrop-filter:blur");
    expect(css).toContain("rgba(34,211,238");
  });
});
