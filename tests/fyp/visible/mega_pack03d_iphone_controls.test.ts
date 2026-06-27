import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Mega Pack 03D — iPhone Control Visibility", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("hides global navigation and home beacon on FYP", () => {
    expect(src).toContain('nav[aria-label="Global portal navigation"]');
    expect(src).toContain('[data-home-beacon-state]');
    expect(src).toContain("display: none !important");
  });

  it("uses small viewport height for mobile Safari", () => {
    expect(src).toContain("100svh");
  });

  it("keeps right rail compact and visible", () => {
    expect(src).toContain("top-[calc(env(safe-area-inset-top)+4.7rem)]");
    expect(src).toContain("h-12 w-12");
  });

  it("keeps all required actions and dock labels", () => {
    expect(src).toContain("Deep");
    expect(src).toContain("Board");
    expect(src).toContain("Share");
    expect(src).toContain("LumaSpace");
    expect(src).toContain("Home");
    expect(src).toContain("Flow");
    expect(src).toContain("Live");
    expect(src).toContain("Trace");
    expect(src).toContain("Space");
  });
});
