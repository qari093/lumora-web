import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 07 — Interaction Layer Lock", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps all right-rail interaction labels", () => {
    expect(src).toContain("Deep");
    expect(src).toContain("Board");
    expect(src).toContain("Share");
    expect(src).toContain("LumaSpace");
  });

  it("keeps interaction buttons accessible", () => {
    expect(src).toContain('type="button"');
    expect(src).toContain('aria-label={label || "Curiosity"}');
  });

  it("keeps visual feedback-ready button styling", () => {
    expect(src).toContain("boxShadow");
    expect(src).toContain("backdropFilter");
    expect(src).toContain("borderRadius: 999");
  });

  it("keeps internal LumaSpace integration slot ready", () => {
    expect(src).toContain("data-lumaspace-star-portal-slot");
  });
});
