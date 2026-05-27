import { describe, expect, it } from "vitest";
import {
  applyMiniMirrorFeedback,
  buildAnnualSymbolConstellation,
  buildEmotionalWeather,
  createMiniMirror,
  formatTimestamp,
  generateWhispers,
  isWhisperCopySafe
} from "@/src/core/creator-alchemy/whisper";

const events = [
  {
    signal: "tone_softening" as const,
    videoId: "v1",
    timestampSeconds: 42,
    strength: 0.91,
    sampleSize: 20
  },
  {
    signal: "silent_linger" as const,
    videoId: "v2",
    timestampSeconds: 58,
    strength: 0.73,
    sampleSize: 13
  },
  {
    signal: "save_overlap" as const,
    videoId: "v3",
    strength: 0.62,
    sampleSize: 9
  }
];

describe("Creator Alchemy Pack 03 — Whisper Engine Ω", () => {
  it("formats timestamps for play-to-moment whispers", () => {
    expect(formatTimestamp(42)).toBe("0:42");
    expect(formatTimestamp(125)).toBe("2:05");
  });

  it("generates one restrained whisper by default", () => {
    const whispers = generateWhispers(events, false);
    expect(whispers).toHaveLength(1);
    expect(whispers[0]?.safe).toBe(true);
    expect(whispers[0]?.text).toContain("tone softened");
  });

  it("allows max three whispers in creative intensity mode", () => {
    const whispers = generateWhispers(events, true);
    expect(whispers.length).toBeLessThanOrEqual(3);
    expect(whispers.length).toBeGreaterThan(1);
  });

  it("builds scarce emotional weather", () => {
    expect(buildEmotionalWeather(events, 0).visible).toBe(true);
    expect(buildEmotionalWeather(events, 4).visible).toBe(false);
  });

  it("creates Mini-Mirror symbols and respects creator rejection", () => {
    const mirror = createMiniMirror("2026-05", events);
    const rejected = applyMiniMirrorFeedback(mirror, false);
    const accepted = applyMiniMirrorFeedback(mirror, true);

    expect(rejected.stored).toBe(false);
    expect(accepted.stored).toBe(true);
  });

  it("builds annual constellation only from accepted symbols", () => {
    const m1 = applyMiniMirrorFeedback(createMiniMirror("2026-01", events), true);
    const m2 = applyMiniMirrorFeedback(createMiniMirror("2026-02", events), false);

    expect(buildAnnualSymbolConstellation([m1, m2])).toHaveLength(1);
  });

  it("blocks unsafe whisper copy", () => {
    expect(isWhisperCopySafe("You are depressed and your audience needs you")).toBe(false);
    expect(isWhisperCopySafe("Viewers lingered longer during your softer silence.")).toBe(true);
  });
});
