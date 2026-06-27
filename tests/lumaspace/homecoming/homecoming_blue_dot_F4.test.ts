import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LumaSpace Ω∞ F4 — Homecoming Blue Dot", () => {
  it("restores the light blue dot beside YOUR SPACE", () => {
    const component = fs.readFileSync(
      "src/components/lumaspace/homecoming/HomecomingRitualOmega.tsx",
      "utf8"
    );

    expect(component).toContain("ls-homecoming-blue-dot");
    expect(component).toContain("YOUR SPACE.");
  });

  it("styles the dot as light blue glow", () => {
    const css = fs.readFileSync(
      "src/styles/lumaspace/homecoming-ritual-omega.css",
      "utf8"
    );

    expect(css).toContain("#67e8f9");
    expect(css).toContain("ls-homecoming-blue-dot");
    expect(css).toContain("border-radius: 999px");
  });
});
