import { describe, expect, it } from "vitest";
import {
  buildScaleReport,
  createCrossRunSeenSet,
  filterAlreadyIngested,
  validateScaleTargets,
} from "../../scripts/fyp94/pool_scale_guard.mjs";

describe("Phase 3 Pack 6 — Pool Scale + Cross-Run Deduping", () => {
  const manifest = Array.from({ length: 320 }).map((_, i) => ({
    id: i + 1,
    source: i % 2 === 0 ? "pexels" : "pixabay",
    sourceId: String(i + 1),
    query: `query_${i % 12}`,
    mp4Url: `https://example.com/${i + 1}.mp4`,
  }));

  it("creates seen set across prior runs", () => {
    const seen = createCrossRunSeenSet(manifest);
    expect(seen.has("pexels:1")).toBe(true);
    expect(seen.size).toBe(320);
  });

  it("prevents duplicate ingestion across runs", () => {
    const candidates = [
      { source: "pexels", sourceId: "1", mp4Url: "dup.mp4" },
      { source: "pexels", sourceId: "999", mp4Url: "new.mp4" },
    ];

    const out = filterAlreadyIngested(candidates, manifest);
    expect(out).toHaveLength(1);
    expect(out[0].sourceId).toBe("999");
  });

  it("validates 300+ pool and 500+ growth target", () => {
    const scale = validateScaleTargets(manifest);
    expect(scale.ready300).toBe(true);
    expect(scale.ready500).toBe(false);
    expect(scale.queryOk).toBe(true);
  });

  it("builds scale report", () => {
    const report = buildScaleReport(manifest);
    expect(report.total).toBe(320);
    expect(report.target300).toBe(true);
    expect(report.ok).toBe(true);
  });
});
