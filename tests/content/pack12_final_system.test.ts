import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { validateFinalSystem } from "@/src/lib/content/final/finalValidation";

describe("Lumora Pack 12 — final system validation", () => {
  it("validates adapter coverage and restrictions", () => {
    const res = validateFinalSystem();

    expect(res.adapterCount).toBeGreaterThanOrEqual(45);
    expect(res.hasMinimumAdapters).toBe(true);
    expect(res.restrictedSourcesExcluded).toBe(true);
  });

  it("fyp94 route exists and wired", () => {
    expect(fs.existsSync("app/api/fyp94/library/route.ts")).toBe(true);
  });
});
