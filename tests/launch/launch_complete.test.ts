import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("launch complete", () => {
  it("locks final complete state", () => {
    const run = fs.readFileSync(".lumora_launch_run", "utf8");
    const complete = fs.readFileSync(".lumora_launch_complete", "utf8");

    expect(run.includes("LUMORA_LAUNCH_LAST_COMPLETED_STEP=111")).toBe(true);
    expect(run.includes("LUMORA_LAUNCH_TOTAL_STEPS=111")).toBe(true);
    expect(run.includes("LUMORA_LAUNCH_PHASE=COMPLETE")).toBe(true);
    expect(run.includes("LUMORA_LAUNCH_STATUS=COMPLETE")).toBe(true);
    expect(complete.includes("LUMORA_LAUNCH_COMPLETE=true")).toBe(true);
  });
});
