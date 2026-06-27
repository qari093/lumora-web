import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LumaSpace Ω∞ F4 — Homecoming Overlay Visibility", () => {
  it("hardens overlay with inline max z-index", () => {
    const component = fs.readFileSync(
      "src/components/lumaspace/homecoming/HomecomingRitualOmega.tsx",
      "utf8"
    );

    expect(component).toContain("2147483647");
    expect(component).toContain("isolation");
    expect(component).toContain("useEffect");
    expect(component).toContain("homecoming");
    expect(component).toContain("hold");
  });

  it("hardens css hold mode visibility", () => {
    const css = fs.readFileSync(
      "src/styles/lumaspace/homecoming-ritual-omega.css",
      "utf8"
    );

    expect(css).toContain("z-index: 2147483647 !important");
    expect(css).toContain("display: grid !important");
    expect(css).toContain("background: #02030a !important");
  });
});
