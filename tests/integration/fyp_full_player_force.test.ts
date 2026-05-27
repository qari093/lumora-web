import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("forced fyp full player", () => {
  it("has sound, seek bar, reverse and forward", () => {
    const file = fs.readFileSync("components/fyp/FypFullPlayer.tsx", "utf8");
    const page = fs.readFileSync("app/fyp/page.tsx", "utf8");

    expect(page).toContain("FypFullPlayer");
    expect(file).toContain("🔇 Sound");
    expect(file).toContain('type="range"');
    expect(file).toContain("seek(-5)");
    expect(file).toContain("seek(5)");
    expect(file).toContain("FypRuntimeVideoSignalBridge");
  });
});
