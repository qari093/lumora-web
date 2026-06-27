import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Mega Pack C — Route Isolation", () => {
  const layout = fs.readFileSync("app/fyp/layout.tsx", "utf8");
  const cleaner = fs.readFileSync("app/fyp/FypShellCleaner.tsx", "utf8");
  const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("hides global navigation and home beacon", () => {
    expect(layout).toContain('Global portal navigation');
    expect(layout).toContain('Lumora portal arc');
    expect(layout).toContain('lumora-home-beacon');
    expect(cleaner).toContain('MutationObserver');
  });

  it("locks FYP body into isolated fullscreen mode", () => {
    expect(layout).toContain("lumora-fyp-isolated");
    expect(layout).toContain("overflow: hidden !important");
    expect(layout).toContain("height: 100svh");
  });

  it("hides native browser video controls", () => {
    expect(layout).toContain("video::-webkit-media-controls");
    expect(player).toContain("controls={false}");
  });

  it("keeps the FYP player mounted as fullscreen canvas", () => {
    expect(player).toContain("fixed inset-0");
    expect(player).toContain("z-[2147483647]");
    expect(player).toContain("h-[100svh]");
  });
});
