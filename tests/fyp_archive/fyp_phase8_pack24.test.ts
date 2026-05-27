import { describe, it, expect } from "vitest";
import { ARCHIVE_PRODUCTION_LOCK, validateProductionReadiness } from "../../src/lib/fyp_archive/production_lock";
import { buildFinalSystemReport } from "../../src/lib/fyp_archive/final_report";

describe("Phase 8 Pack 24 — Final System Seal", () => {
  it("locks production configuration", () => {
    expect(ARCHIVE_PRODUCTION_LOCK.noAiGeneratedContent).toBe(true);
    expect(ARCHIVE_PRODUCTION_LOCK.archiveEnabled).toBe(true);
  });

  it("builds final system report", () => {
    const feed = Array.from({ length: 320 }).map((_, i) => ({
      id: String(i),
      query: `query_${i % 10}`,
      hasAudio: i % 2 === 0,
    }));

    const report = buildFinalSystemReport(feed);

    expect(report.total).toBe(320);
    expect(report.ready).toBe(true);
  });

  it("validates production readiness", () => {
    const out = validateProductionReadiness({
      total: 320,
      diversity: 10,
      audioRatio: 0.5,
    });

    expect(out.ok).toBe(true);
    expect(out.noAiEnabled).toBe(true);
  });
});
