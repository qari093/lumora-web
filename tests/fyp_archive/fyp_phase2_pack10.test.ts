import { describe, expect, it } from "vitest";
import {
  avoidCalmOnlySequences,
  buildArchiveExperienceFeed,
  injectUnexpectedArchiveMoments,
  mixEmotionalTones,
  prioritizeRealLifeChaos,
  scoreRealLifeChaos,
} from "../../src/lib/fyp_archive/experience_layer";

describe("Phase 2 Pack 10 — Real-Feeling Experience Layer", () => {
  const items = [
    { id: "1", title: "calm landscape", tone: "calm", humanScore: 0 },
    { id: "2", title: "crowd reaction street", tone: "surprise", humanScore: 0.5 },
    { id: "3", title: "kids unexpected moment", tone: "joy", humanScore: 0.5 },
  ];

  it("scores real-life chaos", () => {
    expect(scoreRealLifeChaos(items[1])).toBeGreaterThan(scoreRealLifeChaos(items[0]));
  });

  it("prioritizes chaos clips", () => {
    const out = prioritizeRealLifeChaos(items);
    expect(out[0].id).toBe("2");
  });

  it("injects unexpected archive moments", () => {
    const out = injectUnexpectedArchiveMoments([items[0]], items);
    expect(out.some((x: any) => x.unexpectedMoment)).toBe(true);
  });

  it("mixes emotional tones", () => {
    const out = mixEmotionalTones(items);
    expect(out.length).toBe(items.length);
  });

  it("avoids calm-only sequences", () => {
    const out = avoidCalmOnlySequences([
      { id: "1", tone: "calm" },
      { id: "2", tone: "calm" },
      { id: "3", tone: "calm" },
      { id: "4", tone: "surprise" },
    ]);

    expect(out.length).toBe(3);
  });

  it("builds archive experience feed", () => {
    const out = buildArchiveExperienceFeed(items);
    expect(out.length).toBeGreaterThan(0);
    expect(out[0].id).not.toBe("1");
  });
});
