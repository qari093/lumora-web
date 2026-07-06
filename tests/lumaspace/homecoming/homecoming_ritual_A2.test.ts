import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { validateHomecomingSequence, HomecomingSequence } from "@/src/core/lumaspace/homecoming/homecomingSequence";

describe("LumaSpace Ω∞ Mega Pack A2 — Homecoming Ritual", () => {
  it("locks sacred Homecoming sequence", () => {
    expect(validateHomecomingSequence()).toBe(true);
    expect(HomecomingSequence.sequence).toEqual(["BLACK", "BLUE_BLADE", "LIVING_SPARK", "YOUR_SPACE", "YOUR_PEOPLE", "YOUR_STORY", "UNIVERSE_UNFOLDS"]);
  });

  it("creates ritual component", () => {
    const src = fs.readFileSync("src/components/lumaspace/homecoming/HomecomingRitualOmega.tsx", "utf8");
    expect(src).toContain("ls-homecoming-ritual");
    expect(src).toContain("ls-homecoming-blue-blade");
    expect(src).toContain("ls-homecoming-spark");
    expect(src).toContain("Welcome home.");
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
