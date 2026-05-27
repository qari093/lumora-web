import { describe, expect, it } from "vitest";
import {
  appendManifest,
  buildIngestionLog,
  getPoolMetrics,
  validatePoolReadiness,
} from "../../scripts/fyp94/pool_expansion.mjs";

describe("Phase 3 Pack 5 — Pool Expansion + Metrics", () => {
  const manifest = Array.from({ length: 320 }).map((_, i) => ({
    id: i + 1,
    query: `query_${i % 12}`,
    source: i % 2 === 0 ? "pexels" : "pixabay",
    mp4Url: `https://cdn.example.com/${i + 1}.mp4`,
  }));

  it("appends to manifest instead of overwriting", () => {
    expect(appendManifest([{ id: 1 }], [{ id: 2 }])).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("tracks pool size and diversity metrics", () => {
    const m = getPoolMetrics(manifest);

    expect(m.total).toBe(320);
    expect(m.queryDiversity).toBe(12);
    expect(m.sourceDiversity).toBe(2);
    expect(m.duplicateCount).toBe(0);
  });

  it("validates minimum pool readiness", () => {
    const ready = validatePoolReadiness(manifest);

    expect(ready.ok).toBe(true);
    expect(ready.total).toBeGreaterThanOrEqual(300);
    expect(ready.queryDiversity).toBeGreaterThanOrEqual(10);
  });

  it("logs ingestion metrics", () => {
    const log = buildIngestionLog({ added: 120, skipped: 8, manifest });

    expect(log.added).toBe(120);
    expect(log.skipped).toBe(8);
    expect(log.total).toBe(320);
  });
});
