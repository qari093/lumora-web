import { describe, it, expect } from "vitest";
import { applySessionParamsToCallConfig } from "@/lib/lumalink/translate/runtime/uiControls";
import type { CallTranslationConfig, TranslationSessionParams } from "@/lib/lumalink/translate/core/types";

function baseCfg(): CallTranslationConfig {
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

describe("LumaLink runtime adapter: UI controls -> CallTranslationConfig", () => {
  it("defaults tone to neutral and sets to from UI", () => {
    const params: TranslationSessionParams = {
      scope: "message",
      ui: { language: { autoDetect: true, to: "de" }, tone: "neutral" },
    };
    const out = applySessionParamsToCallConfig(baseCfg(), params);
    expect(out.to).toBe("de");
    expect(out.tone).toBe("neutral");
    expect(out.sessionParams?.scope).toBe("message");
  });

  it("overrides from only when autoDetect=false + from provided", () => {
    const params: TranslationSessionParams = {
      scope: "voice_call",
      ui: { language: { autoDetect: false, from: "ur", to: "en" }, tone: "formal" },
    };
    const out = applySessionParamsToCallConfig(baseCfg(), params);
    expect(out.from).toBe("ur");
    expect(out.to).toBe("en");
    expect(out.tone).toBe("formal");
  });

  it("keeps base.from when autoDetect=true", () => {
    const params: TranslationSessionParams = {
      scope: "video_call",
      ui: { language: { autoDetect: true, to: "fr" }, tone: "informal" },
    };
    const out = applySessionParamsToCallConfig(baseCfg(), params);
    expect(out.from).toBe("en");
    expect(out.to).toBe("fr");
    expect(out.tone).toBe("informal");
  });
});
