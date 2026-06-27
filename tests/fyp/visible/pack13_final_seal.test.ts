import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 13 — Final Seal", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("has all canonical FYP sections", () => {
    expect(src).toContain('data-testid="fyp-omega-depthcanvas"');
    expect(src).toContain('data-testid="fyp-omega-video"');
    expect(src).toContain('FypOmegaIdentity');
    expect(src).toContain('data-testid="fyp-right-rail"');
    expect(src).toContain('data-testid="fyp-hero-info"');
    expect(src).toContain('data-testid="fyp-bottom-nav"');
  });

  it("has all 12 prior final pack locks", () => {
    for (let i = 1; i <= 12; i++) {
      const n = String(i).padStart(2, "0");
      expect(fs.existsSync(`.fyp_omega_final_pack${n}_lock`)).toBe(true);
    }
  });

  it("keeps final LumaSpace integration ready", () => {
    expect(src).toContain("LumaSpace");
    expect(src).toContain("data-lumaspace-star-portal-slot");
    expect(src).toContain("Genesis Collection");
  });

  it("keeps final human-first FYP philosophy enforced in code surface", () => {
    expect(src).toContain("curiosity");
    expect(src).not.toMatch(/\bfollowers?\b/i);
    expect(src).not.toMatch(/\bfollowing\b/i);
    expect(src).not.toMatch(/\blikes?\b/i);
    expect(src).not.toMatch(/\bviews?\b/i);
  });
});
