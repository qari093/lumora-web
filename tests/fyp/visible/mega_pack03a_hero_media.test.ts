import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Mega Pack 03A — Hero Media Engine", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps real playback essentials", () => {
    expect(src).toContain('data-testid="fyp-omega-video"');
    expect(src).toContain("playsInline");
    expect(src).toContain("autoPlay");
    expect(src).toContain("controls={false}");
  });

  it("uses cinematic hero media height instead of stretched full screen media", () => {
    expect(src).toContain("h-[72dvh]");
    expect(src).toContain("object-cover object-center");
    expect(src).not.toContain("h-[100dvh] w-screen object-cover");
  });

  it("adds the hero information surface", () => {
    expect(src).toContain('data-testid="fyp-hero-info-surface"');
    expect(src).toContain('data-testid="fyp-hero-info"');
  });

  it("keeps locked Primal Canvas elements", () => {
    expect(src).toContain("LUMORA");
    expect(src).toContain("Genesis Collection");
    expect(src).toContain("LumaSpace");
    expect(src).toContain("Lumora Genesis · CC0 · 4K");
  });

  it("uses iPhone safe-area positioning", () => {
    expect(src).toContain("env(safe-area-inset-top)");
    expect(src).toContain("env(safe-area-inset-bottom)");
  });
});
