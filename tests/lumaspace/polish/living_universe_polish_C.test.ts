import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  LivingUniversePolish,
  validateLivingUniversePolish
} from "@/src/core/lumaspace/polish/livingUniversePolish";

describe("LumaSpace Ω∞ Mega Step C — Living Universe Polish", () => {
  it("locks polish doctrine without replacing architecture", () => {
    expect(validateLivingUniversePolish()).toBe(true);
    expect(LivingUniversePolish.lockedArchitecture).toEqual([
      "HomecomingRitualOmega",
      "LumaAtmosphereEngine",
      "EnvironmentalWorldEffects",
      "PresenceConstellationField",
      "LivingUniverseComposer"
    ]);
  });

  it("keeps canonical runtime layers intact", () => {
    const runtime = fs.readFileSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx", "utf8");

    for (const layer of LivingUniversePolish.lockedArchitecture) {
      expect(runtime).toContain(layer);
    }

    expect(runtime).not.toContain("LivingGlassWorlds");
    expect(runtime).not.toContain("lumaspace-worlds-layer");
    expect(runtime).not.toContain("lumaspace-runtime-center");
  });

  it("adds world identity atmosphere details", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe-composer.css", "utf8");

    expect(css).toContain("lsFireflies");
    expect(css).toContain("lsStardust");
    expect(css).toContain("lsForgeTurn");
    expect(css).toContain("lsQuietStars");
    expect(css).toContain("lsWaterRipple");
    expect(css).toContain("linear-gradient(rgba(255,255,255,.035) 1px");
  });

  it("keeps text hidden and YOU dominant", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe-composer.css", "utf8");

    expect(css).toContain("width: 126px");
    expect(css).toContain("opacity: 0 !important");
    expect(css).toContain("lsYouAuraBreath");
  });

  it("keeps reduced-motion safety", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe-composer.css", "utf8");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain("animation: none !important");
  });
});
