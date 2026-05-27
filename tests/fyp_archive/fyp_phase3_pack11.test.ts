import { describe, expect, it } from "vitest";
import {
  buildArchiveDedupeKey,
  maintainArchiveLongTailDiversity,
  preventDuplicateArchiveIngestion,
  trackArchiveRatio,
  validateArchiveDepth,
} from "../../src/lib/fyp_archive/depth_control";

describe("Phase 3 Pack 11 — Archive Depth + Duplicate Control", () => {
  it("builds archive dedupe key", () => {
    expect(buildArchiveDedupeKey({ source: "archive", sourceId: "a", archiveFile: "clip.mp4" })).toBe("archive:a:clip.mp4");
  });

  it("prevents duplicate archive ingestion", () => {
    const out = preventDuplicateArchiveIngestion(
      [{ source: "archive", sourceId: "a", archiveFile: "1.mp4" }],
      [
        { source: "archive", sourceId: "a", archiveFile: "1.mp4" },
        { source: "archive", sourceId: "b", archiveFile: "2.mp4" },
      ],
    );

    expect(out).toHaveLength(1);
    expect(out[0].sourceId).toBe("b");
  });

  it("tracks archive ratio", () => {
    const ratio = trackArchiveRatio([
      { source: "archive" },
      { source: "pexels" },
      { source: "pixabay" },
    ]);

    expect(ratio.archiveCount).toBe(1);
    expect(ratio.ratio).toBeGreaterThan(0);
  });

  it("validates archive depth", () => {
    const items = Array.from({ length: 500 }).map((_, index) => ({
      decade: `${1930 + (index % 7) * 10}s`,
      query: `query_${index % 12}`,
    }));

    const out = validateArchiveDepth(items);
    expect(out.poolReady).toBe(true);
    expect(out.diversityReady).toBe(true);
  });

  it("maintains long-tail diversity", () => {
    const items = Array.from({ length: 50 }).map((_, index) => ({ query: "same", id: index }));
    expect(maintainArchiveLongTailDiversity(items, 30)).toHaveLength(30);
  });
});
