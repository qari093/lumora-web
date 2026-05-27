import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  PRODUCTION_LOCK,
  buildProductionReadinessReport,
  validateApiPerformance,
  validateMp4Only,
} from "../../scripts/fyp94/production_lock.mjs";

describe("Phase 9 Pack 15 — Performance + Production Lock", () => {
  it("locks MP4-only lightweight format", () => {
    expect(validateMp4Only([
      { localUrl: "/native-fyp/real/1.mp4" },
      { mp4Url: "https://example.com/2.mp4" },
    ])).toBe(true);
  });

  it("validates fast API response target", () => {
    expect(validateApiPerformance({ responseMs: 120 })).toBe(true);
    expect(validateApiPerformance({ responseMs: 500 })).toBe(false);
  });

  it("builds production readiness report", () => {
    const report = buildProductionReadinessReport({
      manifest: [{ localUrl: "/native-fyp/real/1.mp4" }],
      responseMs: 100,
    });

    expect(report.ready).toBe(true);
    expect(report.noAiEnabled).toBe(true);
  });

  it("locks no-AI production rule", () => {
    expect(PRODUCTION_LOCK.noAiEnabled).toBe(true);

    const doc = fs.readFileSync("docs/fyp94/REAL_LIFE_FYP_FINAL_LOCK.md", "utf8");
    expect(doc).toContain("No AI unless explicitly commanded");
    expect(doc).toContain("Real video only");
  });
});
