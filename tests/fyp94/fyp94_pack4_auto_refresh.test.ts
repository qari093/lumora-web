import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 Pack 4 — Auto Refresh System", () => {
  it("has refresh script and scheduler hint", () => {
    expect(fs.existsSync("scripts/fyp94/auto_refresh.mjs")).toBe(true);
    expect(fs.existsSync("scripts/fyp94/run_auto_refresh.sh")).toBe(true);
    expect(fs.existsSync("scripts/fyp94/install_cron_hint.sh")).toBe(true);
  });

  it("has storage cap and archive logic", () => {
    const s = fs.readFileSync("scripts/fyp94/auto_refresh.mjs", "utf8");

    expect(s).toContain("MAX_CLIPS");
    expect(s).toContain("storageCapGuard");
    expect(s).toContain("archiveOldClips");
    expect(s).toContain("public/native-fyp/archive");
  });

  it("has refresh validation output", () => {
    const s = fs.readFileSync("scripts/fyp94/auto_refresh.mjs", "utf8");

    expect(s).toContain("AUTO_REFRESH_ACTIVE");
    expect(s).toContain("AUTO_REFRESH_ARCHIVED");
    expect(s).toContain("AUTO_REFRESH_DONE");
  });
});
