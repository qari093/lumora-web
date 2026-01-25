import { describe, it, expect } from "vitest";
import { TranslationSession } from "@/lib/lumalink/translate/runtime/session";
import type { CallTranslationConfig, Consent } from "@/lib/lumalink/translate/core/types";

function mkConsent(granted: boolean): Consent {
  return {
    granted,
    ts: Date.now(),
    scope: { voice: true, captions: true, storeNothing: true },
  };
}

function mkCfg(): CallTranslationConfig {
  return {
    enabled: true,
    mode: "audio_replace",
    from: "en",
    to: "fr",
    provider: "mock",
    maxEndToEndLatencyMs: 5_000,
    preserveVoice: false,
  };
}

describe("LumaLink translation pipeline (mock)", () => {
  it("rejects start without consent", async () => {
    const s = new TranslationSession(mkCfg(), mkConsent(false));
    await expect(s.start()).rejects.toThrow(/consent/i);
  });

  it("emits translated captions + audio chunks in mock mode", async () => {
    const s = new TranslationSession(mkCfg(), mkConsent(true));
    const caps: string[] = [];
    let audioBytes = 0;

    s.onCaptions((txt) => caps.push(txt));
    s.onAudio((pcm) => { audioBytes += pcm.byteLength; });

    await s.start();
    // 20ms audio frame placeholder (PCM16 mono, 16kHz => 640 bytes for 20ms)
    await s.pushAudio(Buffer.alloc(640, 1), 0);
    await s.stop();

    expect(caps.join(" ")).toContain("mock mt fr");
    expect(audioBytes).toBeGreaterThan(0);
  });

  it("supports captions_only mode (no TTS), still emits captions", async () => {
    const cfg = { ...mkCfg(), mode: "captions_only" as const };
    const s = new TranslationSession(cfg, mkConsent(true));
    const caps: string[] = [];
    let audioBytes = 0;

    s.onCaptions((txt) => caps.push(txt));
    s.onAudio((pcm) => { audioBytes += pcm.byteLength; });

    await s.start();
    await s.pushAudio(Buffer.alloc(640, 1), 0);
    await s.stop();

    expect(caps.join(" ")).toContain("mock asr");
    expect(audioBytes).toBe(0);
  });
});
