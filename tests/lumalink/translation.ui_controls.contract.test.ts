import { describe, it, expect } from "vitest";
import type {
  TranslationTone,
  TranslationUIControls,
  TranslationSessionParams,
  TranslationSessionScope,
} from "@/lib/lumalink/translate/core/types";

describe("LumaLink Translation UI Controls — contract", () => {
  it("tone supports exactly formal|neutral|informal", () => {
    const a: TranslationTone = "formal";
    const b: TranslationTone = "neutral";
    const c: TranslationTone = "informal";
    expect([a, b, c]).toEqual(["formal", "neutral", "informal"]);
  });

  it("language selector requires 'to' and default autoDetect behavior is explicit", () => {
    const ui: TranslationUIControls = {
      language: { autoDetect: true, to: "de" },
      tone: "neutral",
    };
    expect(ui.language.to).toBe("de");
    expect(ui.language.autoDetect).toBe(true);
  });

  it("session params apply uniformly across message|voice_call|video_call", () => {
    const scopes: TranslationSessionScope[] = ["message", "voice_call", "video_call"];
    const base = {
      ui: { language: { autoDetect: true, to: "fr" }, tone: "neutral" as const },
    };

    const params: TranslationSessionParams[] = scopes.map((scope) => ({ scope, ...base }));
    expect(params.map((p) => p.scope)).toEqual(scopes);
    expect(params.every((p) => p.ui.tone === "neutral")).toBe(true);
  });
});
