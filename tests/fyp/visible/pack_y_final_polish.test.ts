import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack Y — Final Polish", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("removes stray standalone N ghosts from player source", () => {
    expect(src).not.toMatch(/>\s*N\s*</);
  });

  it("keeps curiosity ring visible", () => {
    expect(src).toContain("curiosity");
    expect(src).toContain("strokeDashoffset");
    expect(src).toContain("30%");
  });

  it("uses readable right rail label sizing", () => {
    expect(src).toContain("fontSize: label === \"LumaSpace\" ? 8 : 9");
  });

  it("prepares LumaSpace Star Portal slot", () => {
    expect(src).toContain("data-lumaspace-star-portal-slot");
  });
});
