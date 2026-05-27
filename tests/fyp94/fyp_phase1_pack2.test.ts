import { describe, expect, it } from "vitest";
import {
  createRealClipKey,
  dedupeRealClips,
  filterRealIngestionCandidates,
  normalizeRealClip,
  passesDurationWindow,
  prefersTargetDuration,
  rejectStaticOrLowMotionClip,
} from "../../scripts/fyp94/real_ingest_schema.mjs";

describe("Phase 1 Pack 2 — real ingestion schema and guards", () => {
  it("normalizes clip schema", () => {
    const clip = normalizeRealClip({
      source: "pexels",
      id: 123,
      url: "https://example.com/a.mp4",
      query: "funny fail",
      duration: "15",
      width: 720,
      height: 1280,
    });

    expect(clip.source).toBe("pexels");
    expect(clip.sourceId).toBe("123");
    expect(clip.mp4Url).toContain(".mp4");
    expect(clip.duration).toBe(15);
  });

  it("dedupes by source/sourceId/url", () => {
    const clips = [
      { source: "pexels", sourceId: "1", mp4Url: "a.mp4", duration: 12 },
      { source: "pexels", sourceId: "1", mp4Url: "a.mp4", duration: 12 },
      { source: "pixabay", sourceId: "2", mp4Url: "b.mp4", duration: 12 },
    ];

    expect(createRealClipKey(clips[0])).toBe("pexels:1:a.mp4");
    expect(dedupeRealClips(clips)).toHaveLength(2);
  });

  it("enforces duration windows", () => {
    expect(passesDurationWindow({ duration: 6 })).toBe(true);
    expect(passesDurationWindow({ duration: 45 })).toBe(true);
    expect(passesDurationWindow({ duration: 4 })).toBe(false);
    expect(passesDurationWindow({ duration: 80 })).toBe(false);

    expect(prefersTargetDuration({ duration: 20 })).toBe(true);
    expect(prefersTargetDuration({ duration: 40 })).toBe(false);
  });

  it("rejects static or low-motion clips", () => {
    expect(rejectStaticOrLowMotionClip({ duration: 12, motionScore: 0.5 })).toBe(true);
    expect(rejectStaticOrLowMotionClip({ duration: 12, motionScore: 0.05 })).toBe(false);
    expect(rejectStaticOrLowMotionClip({ duration: 3, motionScore: 0.8 })).toBe(false);
  });

  it("filters real ingestion candidates end-to-end", () => {
    const clips = filterRealIngestionCandidates([
      { source: "pexels", sourceId: "1", mp4Url: "a.mp4", duration: 2, motionScore: 0.9 },
      { source: "pexels", sourceId: "2", mp4Url: "b.mp4", duration: 15, motionScore: 0.8 },
      { source: "pexels", sourceId: "2", mp4Url: "b.mp4", duration: 15, motionScore: 0.8 },
      { source: "pixabay", sourceId: "3", mp4Url: "c.mp4", duration: 20, motionScore: 0.05 },
      { source: "pixabay", sourceId: "4", mp4Url: "d.mp4", duration: 28, motionScore: 0.6 },
    ]);

    expect(clips).toHaveLength(2);
    expect(clips[0].duration).toBeGreaterThanOrEqual(10);
  });
});
