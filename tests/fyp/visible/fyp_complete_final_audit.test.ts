import { describe, expect, it } from "vitest";
import fs from "node:fs";

const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

describe("FYP Ω∞ Complete Final Audit", () => {
  it("has all final seal locks", () => {
    for (let i = 1; i <= 13; i++) {
      const n = String(i).padStart(2, "0");
      expect(fs.existsSync(`.fyp_omega_final_pack${n}_lock`)).toBe(true);
    }
    expect(fs.existsSync(".fyp_omega_final_primal_canvas_lock")).toBe(true);
  });

  it("keeps canonical UI sections", () => {
    expect(src).toContain('data-testid="fyp-omega-depthcanvas"');
    expect(src).toContain('data-testid="fyp-omega-video"');
    expect(src).toContain('data-testid="fyp-right-rail"');
    expect(src).toContain('data-testid="fyp-hero-info"');
    expect(src).toContain('data-testid="fyp-bottom-nav"');
  });

  it("keeps mobile-safe fullscreen runtime", () => {
    expect(src).toContain('height: "100svh"');
    expect(src).toContain('width: "100vw"');
    expect(src).toContain('controls={false}');
    expect(src).toContain("playsInline");
  });

  it("keeps LumaSpace integration ready", () => {
    expect(src).toContain("LumaSpace");
    expect(src).toContain("data-lumaspace-star-portal-slot");
    expect(src).toContain("Genesis Collection");
  });

  it("keeps human-first rules", () => {
    expect(src).toContain("curiosity");
    expect(src).not.toMatch(/\bfollowers?\b/i);
    expect(src).not.toMatch(/\bfollowing\b/i);
    expect(src).not.toMatch(/\blikes?\b/i);
    expect(src.replace(/viewBox/g, "")).not.toMatch(/\bviews?\b/i);
  });
});
