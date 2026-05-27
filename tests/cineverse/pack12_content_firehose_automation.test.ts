import { describe, expect, it } from "vitest";
import {
  autoApproveFilm,
  monitoredSources,
  queueFilm,
  shouldRunTeaserPipeline,
} from "../../src/cineverse/firehose/runtime";

describe("CineVerse Pack 12 — Content Firehose + Automation", () => {
  it("monitors global sources", () => {
    expect(monitoredSources).toContain("kofa");
    expect(monitoredSources).toContain("internet-archive");
  });

  it("queues and approves legal films", () => {
    expect(queueFilm("mosfilm").queued).toBe(true);
    expect(autoApproveFilm(true)).toBe(true);
    expect(autoApproveFilm(false)).toBe(false);
  });

  it("only runs teaser pipeline for verified queued films", () => {
    expect(shouldRunTeaserPipeline({ queued: true, rightsVerified: true })).toBe(true);
    expect(shouldRunTeaserPipeline({ queued: true, rightsVerified: false })).toBe(false);
  });
});
