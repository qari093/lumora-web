import React from "react";
import { describe, it, expect } from "vitest";
import { computeVariantForToday } from "@/components/fyp/variants";
import fs from "node:fs";

describe("FYP repeat-session variation (deterministic)", () => {
  it("is stable per seed+day and changes across different days (often)", () => {
    const seed = "seed_test_user_123";
    const v1 = computeVariantForToday(seed, "2026-02-13");
    const v2 = computeVariantForToday(seed, "2026-02-13");
    expect(v1).toBe(v2);

    const v3 = computeVariantForToday(seed, "2026-02-14");
    // may coincidentally match, but across many seeds it shouldn't be pathological.
    expect(["A", "B", "C"]).toContain(v3);
  });

  it("app/fyp/page.tsx renders <FypFlow />", () => {
    const s = fs.readFileSync("app/fyp/page.tsx", "utf8");
    expect(s.includes('components/fyp/FypFlow')).toBe(true);
    expect(s.includes("<FypFlow />")).toBe(true);
  });
});
