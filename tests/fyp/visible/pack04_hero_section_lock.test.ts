import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 04 — Hero Section Lock", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps canonical hero section mounted", () => {
    expect(src).toContain('data-testid="fyp-hero-info"');
    expect(src).toContain("{title}");
  });

  it("keeps large cinematic title typography", () => {
    expect(src).toContain("fontSize: 54");
    expect(src).toContain("fontWeight: 950");
    expect(src).toContain("letterSpacing: \"-.05em\"");
    expect(src).toContain("textShadow");
  });

  it("keeps Genesis Collection capsule", () => {
    expect(src).toContain("Genesis Collection");
    expect(src).toContain("1 of 10");
    expect(src).toContain("borderRadius: 999");
  });

  it("keeps hero safely above bottom nav", () => {
    expect(src).toContain('bottom: "calc(env(safe-area-inset-bottom) + 176px)"');
  });
});
