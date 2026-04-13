import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("release seal", () => {
  it("locks final deployment state", () => {
    const text = fs.readFileSync(".lumora_launch_run", "utf8");
    expect(text.includes("LUMORA_LAUNCH_LAST_COMPLETED_STEP=110")).toBe(true);
    expect(text.includes("LUMORA_LAUNCH_TOTAL_STEPS=111")).toBe(true);
    expect(text.includes("LUMORA_LAUNCH_PHASE=SEALED")).toBe(true);
    expect(text.includes("LUMORA_LAUNCH_STATUS=READY_FOR_DEPLOYMENT")).toBe(true);
  });
});
