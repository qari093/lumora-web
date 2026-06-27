import { describe, expect, it } from "vitest";
import fs from "node:fs";

const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx","utf8");

describe("FYP Ω∞ Final Visual Polish", () => {

  it("removes stray N bubble", () => {
    expect(src).not.toContain('>N<');
    expect(src).not.toContain('aria-label="N"');
  });

  it("keeps bottom nav safely above browser UI", () => {
    expect(src).toContain('env(safe-area-inset-bottom)');
    expect(src).toContain('bottom: "calc(env(safe-area-inset-bottom) +');
  });

  it("keeps no browser address elements inside UI", () => {
    expect(src).not.toMatch(/192\.168\./);
    expect(src).not.toMatch(/localhost/i);
  });

  it("keeps LumaSpace official slot", () => {
    expect(src).toContain("data-lumaspace-star-portal-slot");
  });

  it("keeps curiosity ring as primary metric", () => {
    expect(src).toContain("30%");
    expect(src).toContain("curiosity");
  });

});
