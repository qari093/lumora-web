import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  HomecomingSequence,
  validateHomecomingSequence
} from "@/src/core/lumaspace/homecoming/homecomingSequence";

const runtime = () =>
  fs.readFileSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx", "utf8");

describe("LumaSpace Ω∞ F4 — Homecoming Sequence", () => {
  it("locks the ritual sequence", () => {
    expect(validateHomecomingSequence()).toBe(true);
    expect(HomecomingSequence.sequence).toEqual([
      "BLACK",
      "BLUE_BLADE",
      "LIVING_SPARK",
      "YOUR_SPACE",
      "YOUR_PEOPLE",
      "YOUR_STORY",
      "UNIVERSE_UNFOLDS"
    ]);
  });

  it("keeps Homecoming mounted before the universe", () => {
    const s = runtime();

    expect(s).toContain("HomecomingRitualOmega");
    expect(s).toContain("LumaAtmosphereEngine");
    expect(s).toContain("EnvironmentalWorldEffects");
    expect(s).toContain("LivingWorldIdentitiesLayer");
    expect(s).toContain("PresenceConstellationField");
    expect(s).toContain("AmbientPresenceEvolutionLayer");
    expect(s).toContain("InteractionMotionField");
    expect(s).toContain("LivingUniverseComposer");
  });

  it("does not resurrect legacy prototype layers", () => {
    const s = runtime();

    expect(s).not.toContain("lumaspace-worlds-layer");
    expect(s).not.toContain("lumaspace-pulse-layer");
    expect(s).not.toContain("lumaspace-garden-layer");
    expect(s).not.toContain("lumaspace-story-constellation");
    expect(s).not.toContain("lumaspace-reaction-galaxy");
    expect(s).not.toContain("lumaspace-runtime-center");
    expect(s).not.toContain("LivingGlassWorlds");
    expect(s).not.toContain("LivingYouStar");
  });

  it("creates visual ritual component", () => {
    const component = fs.readFileSync(
      "src/components/lumaspace/homecoming/HomecomingRitualOmega.tsx",
      "utf8"
    );

    expect(component).toContain("ls-homecoming-ritual");
    expect(component).toContain("YOUR SPACE.");
    expect(component).toContain("YOUR PEOPLE.");
    expect(component).toContain("YOUR STORY.");
    expect(component).toContain("ls-homecoming-blue-blade");
    expect(component).toContain("ls-homecoming-spark");
  });

  it("keeps reduced motion safety", () => {
    const css = fs.readFileSync(
      "src/styles/lumaspace/homecoming-ritual-omega.css",
      "utf8"
    );

    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain("lsHomecomingRelease");
    expect(css).toContain("lsHomecomingSpark");
    expect(css).toContain("lsHomecomingReducedRelease");
  });
});
