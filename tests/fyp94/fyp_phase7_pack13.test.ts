import { describe, expect, it } from "vitest";
import {
  buildAmbientAudioHook,
  buildNativeSoundCapability,
  buildSoundReadyFeed,
  markAudioAvailability,
} from "../../scripts/fyp94/sound_final_hooks.mjs";

describe("Phase 7 Pack 13 — Sound Strategy Final Hooks", () => {
  it("detects native audio capability", () => {
    expect(buildNativeSoundCapability({ id: "1", hasAudio: true }).canPlayAudio).toBe(true);
    expect(buildNativeSoundCapability({ id: "2" }).fallbackSilent).toBe(true);
  });

  it("marks audio availability on feed", () => {
    const out = markAudioAvailability([{ id: "1", hasAudio: true }, { id: "2" }]);
    expect(out[0].audio.hasNativeAudio).toBe(true);
    expect(out[1].audio.fallbackSilent).toBe(true);
  });

  it("prepares non-AI ambient audio hook", () => {
    const hook = buildAmbientAudioHook({ enabled: true, trackUrl: "/ambient/fyp.mp3" });
    expect(hook.mode).toBe("non-ai-ambient");
    expect(hook.ready).toBe(true);
  });

  it("builds final sound-ready feed policy", () => {
    const out = buildSoundReadyFeed([{ id: "1", hasAudio: false }]);
    expect(out.feed).toHaveLength(1);
    expect(out.policy.aiAudioDisabled).toBe(true);
    expect(out.policy.ambientHookPrepared).toBe(true);
  });
});
