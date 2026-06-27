import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Mega Pack 02D — Final Primal Canvas", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps no debug or ghost FUTU text", () => {
    expect(src).not.toContain("FUTU");
  });

  it("keeps only allowed counter occurrences", () => {
    const matches = src.match(/index\s*\+\s*1\s*\}\s*\/\s*\{\s*feed\.length/g) || [];
    expect(matches.length).toBeLessThanOrEqual(2);
    expect(src).toContain("Genesis Collection");
  });

  it("does not include a Flow badge", () => {
    expect(src).not.toMatch(/absolute[^"]*-top[^"]*.*1\/10/s);
  });

  it("has exactly one bottom-right ghost attribution", () => {
    const matches = src.match(/Lumora Genesis · CC0 · 4K/g) || [];
    expect(matches.length).toBe(1);
    expect(src).toContain("bottom-6 right-4");
    expect(src).toContain("text-white/15");
  });

  it("removes duplicate Genesis subtitle", () => {
    expect(src).not.toContain('"Lumora Genesis Trace"');
  });

  it("uses LumaSpace on right rail while bottom dock remains Space", () => {
    expect(src).toContain("LumaSpace");

    const navMatch = src.match(/<nav[^>]*data-testid="fyp-bottom-nav"[^>]*>([\s\S]*?)<\/nav>/);
    expect(navMatch?.[1] || "").toContain("Space");
    expect(navMatch?.[1] || "").not.toContain("LumaSpace");
  });

  it("preserves playback essentials", () => {
    expect(src).toContain("playsInline");
    expect(src).toContain("autoPlay");
    expect(src).toContain("controls={false}");
    expect(src).toContain("fyp-omega-video");
  });
});
