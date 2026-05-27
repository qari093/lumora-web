import { describe, expect, it } from "vitest";
import {
  detectNativeAudio,
  prioritizeAudioClips,
  markSilentClips,
  preventSilentStreak,
  buildSoundAwareFeed,
} from "../../src/lib/fyp_archive/sound_layer";

describe("Phase 2 Pack 9 — Sound Layer", () => {
  const items = [
    { id: "1", title: "silent archive footage" },
    { id: "2", title: "concert crowd music" },
    { id: "3", title: "interview speech" },
    { id: "4", title: "old home movie" },
  ];

  it("detects native audio", () => {
    expect(detectNativeAudio({ title: "concert music" })).toBe(true);
    expect(detectNativeAudio({ title: "old silent film" })).toBe(false);
  });

  it("prioritizes audio clips", () => {
    const out = prioritizeAudioClips(items);
    expect(detectNativeAudio(out[0])).toBe(true);
  });

  it("marks silent clips", () => {
    const out = markSilentClips(items);
    expect(out[0]).toHaveProperty("silent");
  });

  it("prevents silent streaks", () => {
    const out = preventSilentStreak(items);
    expect(out.length).toBeGreaterThan(0);
  });

  it("builds sound-aware feed", () => {
    const out = buildSoundAwareFeed(items);
    expect(out.feed.length).toBeGreaterThan(0);
    expect(out.hasAudioCount).toBeGreaterThan(0);
  });
});
