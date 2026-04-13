import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("release readiness state", () => {
  it("tracks release-ready launch state", () => {
    const text = fs.readFileSync(".lumora_launch_run", "utf8");
    expect(text.includes("LUMORA_LAUNCH_LAST_COMPLETED_STEP=108")).toBe(true);
    expect(text.includes("LUMORA_LAUNCH_TOTAL_STEPS=111")).toBe(true);
    expect(text.includes("LUMORA_LAUNCH_PHASE=FINAL_GATES")).toBe(true);
    expect(text.includes("LUMORA_LAUNCH_STATUS=RELEASE_READY")).toBe(true);
  });
});
