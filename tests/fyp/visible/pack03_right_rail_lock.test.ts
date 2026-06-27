import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 03 — Right Rail Lock", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps canonical right rail mounted", () => {
    expect(src).toContain('data-testid="fyp-right-rail"');
    expect(src).toContain('"curiosity"');
    expect(src).toContain('"deep"');
    expect(src).toContain('"board"');
    expect(src).toContain('"share"');
    expect(src).toContain('"space"');
  });

  it("keeps curiosity ring restored", () => {
    expect(src).toContain("strokeDashoffset");
    expect(src).toContain("30%");
  });

  it("keeps readable labels and LumaSpace slot", () => {
    expect(src).toContain("Deep");
    expect(src).toContain("Board");
    expect(src).toContain("Share");
    expect(src).toContain("LumaSpace");
    expect(src).toContain("data-lumaspace-star-portal-slot");
  });

  it("uses glyphs, not old emoji action icons", () => {
    expect(src).toContain("CelestialGlyph");
    expect(src).not.toContain("🔍");
    expect(src).not.toContain("📌");
    expect(src).not.toContain("↗️");
    expect(src).not.toContain("🌌");
  });
});
