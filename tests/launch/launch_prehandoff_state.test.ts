import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("launch prehandoff state", () => {
  it("tracks control-surface completion state", () => {
    const text = fs.readFileSync(".lumora_launch_run", "utf8");
    expect(text.includes("LUMORA_LAUNCH_LAST_COMPLETED_STEP=103")).toBe(true);
    expect(text.includes("LUMORA_LAUNCH_TOTAL_STEPS=111")).toBe(true);
    expect(text.includes("LUMORA_LAUNCH_PHASE=CONTROL_SURFACES")).toBe(true);
    expect(text.includes("LUMORA_LAUNCH_STATUS=IN_PROGRESS")).toBe(true);
  });
});
