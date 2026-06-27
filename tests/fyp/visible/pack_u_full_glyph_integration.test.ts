import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack U — Full Glyph Integration", () => {
  const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("uses CelestialGlyph in FYP player", () => {
    expect(player).toContain("CelestialGlyph");
  });

  it("removes ordinary emoji action icons", () => {
    expect(player).not.toContain("��");
    expect(player).not.toContain("📌");
    expect(player).not.toContain("↗️");
    expect(player).not.toContain("🌊");
    expect(player).not.toContain("🔴");
    expect(player).not.toContain("��");
  });

  it("keeps required labels visible", () => {
    expect(player).toContain("Deep");
    expect(player).toContain("Board");
    expect(player).toContain("Share");
    expect(player).toContain("LumaSpace");
    expect(player).toContain("Flow");
    expect(player).toContain("Trace");
  });
});
