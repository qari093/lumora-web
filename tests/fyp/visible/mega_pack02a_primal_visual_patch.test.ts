import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Mega Pack 02A — Primal Visual Patch", () => {
  const source = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("owns the viewport and prevents scroll bleed", () => {
    expect(source).toContain("fixed inset-0");
    expect(source).toContain("h-[100dvh]");
    expect(source).toContain("w-screen");
    expect(source).toContain("overflow-hidden");
  });

  it("removes boxed desktop max-width player layout", () => {
    expect(source).not.toContain("max-w-[520px]");
    expect(source).not.toContain("mx-auto flex h-screen");
    expect(source).toContain("flex h-[100dvh] w-screen");
  });

  it("hardens curiosity ring to 56px", () => {
    expect(source).toContain('data-testid="fyp-curiosity-ring"');
    expect(source).toContain("h-14 w-14 shrink-0");
    expect(source).toContain('width="56"');
    expect(source).toContain('height="56"');
  });

  it("uses floating glass bottom dock", () => {
    expect(source).toContain('data-testid="fyp-bottom-nav"');
    expect(source).toContain("fixed bottom-4 left-4 right-4");
    expect(source).toContain("rounded-full");
    expect(source).toContain("backdrop-blur-2xl");
  });

  it("keeps premium Flow highlight", () => {
    expect(source).toContain("drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]");
    expect(source).toContain("font-semibold text-cyan-200");
  });
});
