import { describe, expect, it } from "vitest";
import {
  buildArchiveEnhancedFeed,
  enforceArchiveRatio,
  mergeMultiSourceFeed,
  splitArchiveAndModern,
  validateFeedBalance,
} from "../../src/lib/fyp_archive/feed_merge";

describe("Phase 2 Pack 8 — Archive + Modern Feed Merge", () => {
  const items = [
    { id: "a1", source: "archive" },
    { id: "a2", source: "archive" },
    { id: "m1", source: "pexels" },
    { id: "m2", source: "pixabay" },
    { id: "m3", source: "pexels" },
    { id: "m4", source: "pixabay" },
  ];

  it("splits archive and modern sources", () => {
    const out = splitArchiveAndModern(items);
    expect(out.archive).toHaveLength(2);
    expect(out.modern).toHaveLength(4);
  });

  it("enforces archive ratio", () => {
    const out = enforceArchiveRatio(
      [{ id: "a1" }, { id: "a2" }, { id: "a3" }],
      [{ id: "m1" }, { id: "m2" }, { id: "m3" }, { id: "m4" }],
      0.3,
    );

    expect(out.archive.length).toBeLessThanOrEqual(2);
  });

  it("merges multi-source feed", () => {
    const out = mergeMultiSourceFeed([{ id: "a1" }], [{ id: "m1" }]);
    expect(out.map((x) => x.id)).toEqual(["m1", "a1"]);
  });

  it("validates feed balance", () => {
    const out = validateFeedBalance(items);
    expect(out.archiveRatio).toBeGreaterThan(0);
  });

  it("builds archive-enhanced feed", () => {
    const out = buildArchiveEnhancedFeed(items);
    expect(out.feed.length).toBeGreaterThan(0);
    expect(out.balance.total).toBe(out.feed.length);
  });
});
