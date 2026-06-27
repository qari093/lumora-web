import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { validateHomecomingSequence, HomecomingSequence } from "@/src/core/lumaspace/homecoming/homecomingSequence";

describe("LumaSpace Ω∞ Mega Pack A2 — Homecoming Ritual", () => {
  it("locks sacred Homecoming sequence", () => {
    expect(validateHomecomingSequence()).toBe(true);
    expect(HomecomingSequence.promise).toEqual(["YOUR SPACE.", "YOUR PEOPLE.", "YOUR STORY."]);
  });

  it("creates ritual component", () => {
    const src = fs.readFileSync("src/components/lumaspace/homecoming/HomecomingRitualOmega.tsx", "utf8");
    expect(src).toContain("ls-homecoming-ritual-omega");
    expect(src).toContain("ls-ritual-blue-blade");
    expect(src).toContain("ls-ritual-spark");
    expect(src).toContain("getHomecomingWhisper");
  });

  it("mounts ritual into runtime", () => {
    const runtime = fs.readFileSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx", "utf8");
    expect(runtime).toContain("HomecomingRitualOmega");
    expect(runtime).not.toContain("<HomecomingOmega />");
  });

  it("keeps reduced motion safe", () => {
    const css = fs.readFileSync("src/styles/lumaspace/homecoming-ritual-omega.css", "utf8");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain("display: none");
  });
});
