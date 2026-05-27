import { describe, expect, it } from "vitest";
import {
  applyContentQualityControl,
  enforceQueryBalance,
  enforceSourceBalance,
  estimateHumanPriority,
  prioritizeHumanInteraction,
  rejectOverPolishedClip,
} from "../../scripts/fyp94/content_quality_control.mjs";

describe("Phase 2 Pack 3 — Content Quality Control", () => {
  it("prioritizes human interaction queries", () => {
    expect(estimateHumanPriority({ query: "crowd cheering" })).toBe(1);
    expect(estimateHumanPriority({ query: "mountain landscape", humanScore: 0.2 })).toBe(0.2);
  });

  it("rejects overly polished/staged clips", () => {
    expect(rejectOverPolishedClip({ polishScore: 0.5 })).toBe(true);
    expect(rejectOverPolishedClip({ polishScore: 0.99 })).toBe(false);
  });

  it("sorts human clips first", () => {
    const out = prioritizeHumanInteraction([
      { id: "nature", query: "mountain landscape", humanScore: 0.1 },
      { id: "people", query: "kids laughing" },
    ]);

    expect(out[0].id).toBe("people");
  });

  it("enforces per-query and per-source caps", () => {
    const clips = Array.from({ length: 20 }).map((_, i) => ({
      id: String(i),
      query: i < 12 ? "crowd cheering" : "city street",
      source: "pexels",
    }));

    expect(enforceQueryBalance(clips, 8).filter((x) => x.query === "crowd cheering")).toHaveLength(8);
    expect(enforceSourceBalance(clips, 10)).toHaveLength(10);
  });

  it("applies quality control end-to-end", () => {
    const out = applyContentQualityControl([
      { id: "1", query: "mountain", polishScore: 0.99, source: "pexels" },
      { id: "2", query: "crowd cheering", polishScore: 0.5, source: "pexels" },
      { id: "3", query: "kids laughing", polishScore: 0.4, source: "pixabay" },
    ]);

    expect(out).toHaveLength(2);
    expect(out[0].query).toContain("crowd");
  });
});
