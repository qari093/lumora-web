import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP final mobile layout CSS", () => {
  it("contains Lumora final mobile FYP layout primitives", () => {
    const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");

    expect(css).toContain("LUMORA FYP FINAL MOBILE LAYOUT PATCH");
    expect(css).toContain(".depthTop");
    expect(css).toContain(".laneSwitch button[data-active=\"true\"]");
    expect(css).toContain(".retentionRing");
    expect(css).toContain(".traceDock");
    expect(css).toContain("backdrop-filter: none");
    expect(css).not.toContain("blur(");
    expect(css).toContain("env(safe-area-inset-bottom)");
  });
});
