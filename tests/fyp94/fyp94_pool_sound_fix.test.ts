import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 pool + sound reality fix", () => {
  it("library returns broad verified local pool, not over-strict diversity collapse", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("verifiedLocalCount");
    expect(route).toContain(".slice(0, 80)");
    expect(route).toContain("localFileExists");
    expect(route).not.toContain("maxPerSource = 6");
  });

  it("has audio probe script", () => {
    expect(fs.existsSync("scripts/fyp94/audio_probe.sh")).toBe(true);
  });
});
