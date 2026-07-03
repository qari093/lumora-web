import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LumaSpace F5.5 — Hide leaked global identity badge", () => {
  it("hides global FYP/N identity badge only when LumaSpace runtime exists", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe.css", "utf8");

    expect(css).toContain("F5.5: hide leaked global FYP/N identity badge");
    expect(css).toContain("body:has(.lumaspace-runtime-shell)");
    expect(css).toContain("fyp-omega-identity");
    expect(css).toContain("display: none !important");
    expect(css).toContain("pointer-events: none !important");
  });
});
