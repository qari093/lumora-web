import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  LivingWorldIdentities,
  validateLivingWorldIdentities
} from "@/src/core/lumaspace/experience/livingWorldIdentities";

const runtime = () =>
  fs.readFileSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx", "utf8");

describe("LumaSpace Ω∞ F2 — Living World Identities", () => {
  it("locks six distinct living world identities", () => {
    expect(validateLivingWorldIdentities()).toBe(true);
    expect(LivingWorldIdentities.worlds).toHaveLength(6);
    expect(LivingWorldIdentities.worlds.map((world) => world.id)).toEqual([
      "dream",
      "wonder",
      "creator",
      "shadow",
      "gaming",
      "calm"
    ]);
  });

  it("mounts identity layer without dropping canonical runtime layers", () => {
    const s = runtime();

    expect(s).toContain("LivingWorldIdentitiesLayer");
    expect(s).toContain("HomecomingRitualOmega");
    expect(s).toContain("LumaAtmosphereEngine");
    expect(s).toContain("EnvironmentalWorldEffects");
    expect(s).toContain("PresenceConstellationField");
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

  it("creates visible environmental identity css", () => {
    const css = fs.readFileSync(
      "src/styles/lumaspace/living-world-identities-f2.css",
      "utf8"
    );

    expect(css).toContain("lsF2FireflyDrift");
    expect(css).toContain("cyan");
    expect(css).toContain("conic-gradient");
    expect(css).toContain("linear-gradient(90deg");
    expect(css).toContain("lsF2WaterRipple");
    expect(css).toContain("prefers-reduced-motion");
  });
});
