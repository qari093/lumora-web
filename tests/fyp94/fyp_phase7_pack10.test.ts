import { describe, expect, it } from "vitest";
import {
  attachSoundStateToFeed,
  buildSoundState,
  enforceSoundPolicy,
  hasNativeAudio,
} from "../../scripts/fyp94/sound_strategy.mjs";

describe("Phase 7 Pack 10 — Sound Strategy", () => {
  it("detects native audio flag", () => {
    expect(hasNativeAudio({ hasAudio: true })).toBe(true);
    expect(hasNativeAudio({})).toBe(false);
  });

  it("builds correct sound state labels", () => {
    const s1 = buildSoundState({ muted: true, hasAudio: true });
    const s2 = buildSoundState({ muted: false, hasAudio: true });

    expect(s1.label).toBe("Tap for sound");
    expect(s2.label).toBe("Sound on");
    expect(s2.effectiveSound).toBe(true);
  });

  it("enforces sound policy without blocking playback", () => {
    const clip = enforceSoundPolicy({ id: "1" });
    expect(clip.allowPlayback).toBe(true);
  });

  it("attaches sound state to feed", () => {
    const feed = attachSoundStateToFeed([
      { id: "1", hasAudio: true },
      { id: "2", hasAudio: false },
    ], false);

    expect(feed[0].sound.effectiveSound).toBe(true);
    expect(feed[1].sound.effectiveSound).toBe(false);
  });
});
