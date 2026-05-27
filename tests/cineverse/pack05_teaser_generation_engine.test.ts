import { describe, expect, it } from "vitest";
import { teaserPipelineStages } from "../../src/cineverse/teasers/pipeline";
import { approveTeaser, createTeaserDraft } from "../../src/cineverse/teasers/runtime";

describe("CineVerse Pack 05 — Teaser Generation Engine", () => {
  it("declares the teaser pipeline stages", () => {
    expect(teaserPipelineStages).toContain("ffmpeg-generation");
    expect(teaserPipelineStages).toContain("fyp-insertion");
  });

  it("creates and approves teaser drafts", () => {
    const draft = createTeaserDraft({
      filmId: "film-1",
      title: "Rain Goodbye",
      emotionalHook: "quiet ache",
      startSecond: 120,
      endSecond: 145,
    });

    expect(draft.status).toBe("draft");
    expect(approveTeaser(draft).status).toBe("approved");
  });
});
