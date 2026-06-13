import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP CSS module purity guard", () => {
  it("contains no impure global body selectors or orphan cleanup blocks", () => {
    const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");

    expect(css).not.toContain(":global(body.lumora-fyp-active)");
    expect(css).not.toContain("TRACE CURRENT HOTFIX");
    expect(css).not.toMatch(/\n\s*display:\s*none\s*!important;\s*\}\s*\n\s*\.activeLaneChip/);
    expect(css).toContain(".activeLaneChip");
    expect(css).toContain(".laneSwitch[data-visible=\"true\"]");
  });
});
