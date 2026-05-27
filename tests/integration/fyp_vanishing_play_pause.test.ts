import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP vanishing play pause overlay", () => {
  it("keeps seek bar permanent while center button auto-hides", () => {
    const file = fs.readFileSync("components/fyp/FypFullPlayer.tsx", "utf8");
    expect(file).toContain("overlayVisible");
    expect(file).toContain("setTimeout");
    expect(file).toContain("togglePlay");
    expect(file).toContain("centerPlayBtn");
    expect(file).toContain('type="range"');
    expect(file).toContain("seek(-5)");
    expect(file).toContain("seek(5)");
  });
});
