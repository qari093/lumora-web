import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  getWorldWhisper,
  isSerenitySafeWhisper,
  worldWhispers
} from "@/src/core/lumaspace/presence/worldWhisper";

describe("LumaSpace Ω∞ Mega Pack D — Living Presence Ω", () => {
  it("locks all world whispers as serenity-safe", () => {
    expect(Object.keys(worldWhispers)).toEqual([
      "dream",
      "wonder",
      "creator",
      "shadow",
      "gaming",
      "calm"
    ]);

    for (const whisper of Object.values(worldWhispers)) {
      expect(isSerenitySafeWhisper(whisper)).toBe(true);
    }

    expect(getWorldWhisper("gaming").tone).toContain("warm analog synth");
    expect(getWorldWhisper("calm").tone).toContain("water");
  });

  it("locks ambient trace presence polish", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe.css", "utf8");
    expect(css).toContain("tracePulse");
    expect(css).toContain("presenceBreath");
    expect(css).toContain("1px dashed");
    expect(css).toContain("6s");
  });

  it("locks tactile world whisper surface", () => {
    const worlds = fs.readFileSync("src/components/lumaspace/worlds/LivingGlassWorlds.tsx", "utf8");
    expect(worlds).toContain("data-world-whisper");
    expect(worlds).toContain("getWorldWhisper");
    expect(worlds).toContain("aria-label");
  });

  it("keeps sound doctrine quiet and non-invasive", () => {
    const src = fs.readFileSync("src/core/lumaspace/presence/worldWhisper.ts", "utf8");
    expect(src).toContain("durationMs <= 1500");
    expect(src).toContain("volume <= 0.18");
  });
});
