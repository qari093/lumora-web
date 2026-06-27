import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  getHomecomingAtmosphere,
  getHomecomingPeriod,
  getHomecomingWhisper
} from "@/src/core/lumaspace/homecoming/timeWhisper";

describe("LumaSpace Ω∞ Mega Pack C — Homecoming Ω", () => {
  it("locks time-sensitive Homecoming whispers", () => {
    expect(getHomecomingPeriod(7)).toBe("morning");
    expect(getHomecomingWhisper(7)).toContain("Good morning");
    expect(getHomecomingWhisper(14)).toContain("Welcome home");
    expect(getHomecomingWhisper(20)).toContain("quiet tonight");
    expect(getHomecomingWhisper(2)).toContain("stars are watching");
  });

  it("locks night dim atmosphere", () => {
    expect(getHomecomingAtmosphere(2)).toBe("dim");
    expect(getHomecomingAtmosphere(14)).toBe("soft");
  });

  it("keeps sacred sequence mounted", () => {
    const src = fs.readFileSync("src/components/lumaspace/homecoming/HomecomingOmega.tsx", "utf8");
    expect(src).toContain("ls-blue-blade");
    expect(src).toContain("ls-homecoming-spark");
    expect(src).toContain("YOUR SPACE.");
    expect(src).toContain("YOUR PEOPLE.");
    expect(src).toContain("YOUR STORY.");
    expect(src).toContain("getHomecomingWhisper");
  });

  it("locks whisper fade and reduced motion safety", () => {
    const css = fs.readFileSync("src/styles/lumaspace/homecoming-omega.css", "utf8");
    expect(css).toContain("ls-whisper-volume-fade");
    expect(css).toContain("prefers-reduced-motion");
  });
});
