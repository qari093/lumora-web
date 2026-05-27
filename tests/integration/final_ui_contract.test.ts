import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Final UI Contract", () => {
  it("keeps FYP player controls and runtime dashboard UX", () => {
    const fyp = fs.readFileSync("components/fyp/FypFullPlayer.tsx", "utf8");
    const dash = fs.readFileSync("components/creator-dashboard/CreatorDashboardClient.tsx", "utf8");

    expect(fyp).toContain("🔇 Sound");
    expect(fyp).toContain('type="range"');
    expect(fyp).toContain("seek(-5)");
    expect(fyp).toContain("seek(5)");
    expect(fyp).toContain("overlayVisible");
    expect(fyp).toContain("FypRuntimeVideoSignalBridge");

    expect(dash).toContain("Live Runtime Active");
    expect(dash).toContain("Open FYP");
    expect(dash).toContain("totalSignals");
    expect(dash).toContain("Silent Ovation");
  });
});
