import { describe, expect, it } from "vitest";
import {
  avoidRepetitiveVisualThemes,
  balanceEnergyLevels,
  ensureContinuousNoveltyPerception,
  inferSimpleEmotion,
} from "../../scripts/fyp94/emotion_variation.mjs";

describe("Phase 6 Pack 12 — Emotion Variation + Anti-Repetition", () => {
  const clips = [
    { id: "1", query: "kids laughing", category: "people" },
    { id: "2", query: "football match", category: "sports" },
    { id: "3", query: "ocean waves", category: "nature" },
    { id: "4", query: "city street", category: "urban" },
    { id: "5", query: "festival crowd", category: "events" },
  ];

  it("infers simple emotion buckets", () => {
    expect(inferSimpleEmotion(clips[0])).toBe("joy");
    expect(inferSimpleEmotion(clips[1])).toBe("energy");
    expect(inferSimpleEmotion(clips[2])).toBe("calm");
  });

  it("balances energy levels across feed", () => {
    const out = balanceEnergyLevels(clips);
    expect(out).toHaveLength(clips.length);
    expect(out.every((x: any) => x.emotion)).toBe(true);
  });

  it("avoids repetitive visual themes", () => {
    const repeated = [
      { id: "1", category: "sports" },
      { id: "2", category: "sports" },
      { id: "3", category: "sports" },
      { id: "4", category: "urban" },
    ];

    const out = avoidRepetitiveVisualThemes(repeated, 2);
    expect(out.length).toBeGreaterThan(0);
  });

  it("ensures continuous novelty perception", () => {
    const out = ensureContinuousNoveltyPerception(clips);
    expect(out.some((x: any) => x.noveltySlot === "shift")).toBe(true);
  });
});
