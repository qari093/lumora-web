import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LumaSpace F5 — Hide stray N orb", () => {
  it("hides legacy NEXA orb selectors only inside LumaSpace runtime shell", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe.css", "utf8");

    expect(css).toContain("F5: hide legacy floating NEXA/N orb");
    expect(css).toContain(".lumaspace-runtime-shell .ls-nexa-orb");
    expect(css).toContain(".lumaspace-runtime-shell .ls-nexa-companion");
    expect(css).toContain('[aria-label="Open NEXA companion"]');
    expect(css).toContain("display: none !important");
  });
});
