import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 05 — Bottom Navigation Lock", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps canonical bottom nav mounted", () => {
    expect(src).toContain('data-testid="fyp-bottom-nav"');
  });

  it("keeps exactly the locked five nav destinations", () => {
    expect(src).toContain('"Home"');
    expect(src).toContain('"Flow"');
    expect(src).toContain('"Live"');
    expect(src).toContain('"Trace"');
    expect(src).toContain('"Space"');
  });

  it("keeps bottom nav above mobile browser controls", () => {
    expect(src).toContain('bottom: "calc(env(safe-area-inset-bottom) + 92px)"');
    expect(src).toContain("height: 78");
    expect(src).toContain("borderRadius: 34");
  });

  it("uses CelestialGlyph icons and no old nav emojis", () => {
    expect(src).toContain("CelestialGlyph");
    expect(src).not.toContain("🌊");
    expect(src).not.toContain("🔴");
    expect(src).not.toContain("��");
    expect(src).not.toContain("🌌");
  });
});
