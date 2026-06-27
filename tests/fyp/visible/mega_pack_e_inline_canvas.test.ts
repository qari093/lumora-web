import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Mega Pack E — Inline Cinematic Canvas", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("uses inline fixed fullscreen canvas", () => {
    expect(src).toContain("position: \"fixed\"");
    expect(src).toContain("height: \"100svh\"");
    expect(src).toContain("zIndex: 2147483647");
  });

  it("renders all canonical FYP controls", () => {
    expect(src).toContain("LUMORA");
    expect(src).toContain("Wonder");
    expect(src).toContain("Deep");
    expect(src).toContain("Board");
    expect(src).toContain("Share");
    expect(src).toContain("LumaSpace");
    expect(src).toContain("Genesis Collection");
    expect(src).toContain("Flow");
  });

  it("keeps browser video controls disabled", () => {
    expect(src).toContain("controls={false}");
    expect(src).toContain("playsInline");
  });
});
