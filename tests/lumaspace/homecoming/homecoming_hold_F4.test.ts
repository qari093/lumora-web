import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LumaSpace Ω∞ F4 — Homecoming Hold Verification", () => {
  it("adds query-gated visual hold mode", () => {
    const component = fs.readFileSync(
      "src/components/lumaspace/homecoming/HomecomingRitualOmega.tsx",
      "utf8"
    );

    expect(component).toContain("homecoming");
    expect(component).toContain("hold");
    expect(component).toContain("ls-homecoming-hold");
    expect(component).toContain("data-homecoming-hold");
  });

  it("keeps hold mode css isolated", () => {
    const css = fs.readFileSync(
      "src/styles/lumaspace/homecoming-ritual-omega.css",
      "utf8"
    );

    expect(css).toContain("/lumaspace?homecoming=hold");
    expect(css).toContain("animation-play-state: paused !important");
    expect(css).toContain("visibility: visible !important");
  });
});
