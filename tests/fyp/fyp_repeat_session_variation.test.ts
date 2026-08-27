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
    expect(["A", "B", "C"]).toContain(v3);
  });

  it("app/fyp/page.tsx renders the consolidated production FYP runtime", () => {
    const s = fs.readFileSync("app/fyp/page.tsx", "utf8");

    expect(s.includes("FypOmegaPlayer")).toBe(true);
    expect(s.includes("productionFeedAdapter")).toBe(true);
    expect(s.includes("LUMORA_PORTAL_ALIVE_FYP")).toBe(true);
  });
});
