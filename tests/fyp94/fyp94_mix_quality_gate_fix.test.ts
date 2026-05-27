import { describe, expect, it } from "vitest";
import {
  applyFyp94QualityGate,
  buildFyp94QualityMixedFeed,
  classifyFyp94Source,
  enforceFyp94ArchiveMix,
  scoreFyp94Quality,
} from "../../src/lib/fyp94/quality/mixQualityGate";

describe("FYP94 Mix + Quality Gate Fix", () => {
  const items = [
    { id: "stock-silent-1", source: "pexels", duration: 7, hasAudio: false, humanScore: 0, motionScore: 0.1, query: "mountain stock" },
    { id: "stock-silent-2", source: "pixabay", duration: 8, hasAudio: false, humanScore: 0, motionScore: 0.1, query: "sunset stock" },
    { id: "stock-audio-1", source: "pexels", duration: 18, hasAudio: true, humanScore: 0.2, motionScore: 0.5, query: "street crowd" },
    { id: "social-1", source: "ugc", duration: 22, hasAudio: true, humanScore: 0.8, motionScore: 0.8, query: "crowd reaction" },
    { id: "archive-1", source: "archive", duration: 18, hasAudio: true, humanScore: 0.7, motionScore: 0.6, query: "home movie crowd" },
    { id: "archive-2", source: "prelinger", duration: 30, hasAudio: false, humanScore: 0.5, motionScore: 0.7, query: "street scene family" },
  ];

  it("classifies archive sources", () => {
    expect(classifyFyp94Source({ source: "archive" })).toBe("archive");
    expect(classifyFyp94Source({ source: "prelinger" })).toBe("archive");
    expect(classifyFyp94Source({ mp4Url: "https://archive.org/download/x/y.mp4" })).toBe("archive");
  });

  it("scores archive and human/audio content above silent stock", () => {
    const archiveScore = scoreFyp94Quality(items[4]);
    const silentStockScore = scoreFyp94Quality(items[0]);
    expect(archiveScore).toBeGreaterThan(silentStockScore);
  });

  it("removes low-quality silent stock", () => {
    const out = applyFyp94QualityGate(items);
    expect(out.some((x) => x.id === "stock-silent-1")).toBe(false);
    expect(out.some((x) => x.id === "archive-1")).toBe(true);
  });

  it("enforces archive presence in final batch", () => {
    const out = enforceFyp94ArchiveMix(items, 5, 0.2);
    expect(out.some((x) => x.sourceType === "archive")).toBe(true);
  });

  it("builds final quality mixed feed", () => {
    const out = buildFyp94QualityMixedFeed(items, 5);
    expect(out.length).toBeGreaterThan(0);
    expect(out.some((x) => x.sourceType === "archive")).toBe(true);
    expect(out.some((x) => x.id === "stock-silent-1")).toBe(false);
  });
});
