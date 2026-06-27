import { describe, expect, it } from "vitest";
import fs from "node:fs";

const runtime = () =>
  fs.readFileSync(
    "src/components/lumaspace/runtime/LivingUniverseRuntime.tsx",
    "utf8"
  );

describe("LumaSpace Ω∞ B4 Runtime Consolidation Seal", () => {
  it("keeps only canonical living universe layers", () => {
    const s = runtime();

    expect(s).toContain("HomecomingRitualOmega");
    expect(s).toContain("LumaAtmosphereEngine");
    expect(s).toContain("EnvironmentalWorldEffects");
    expect(s).toContain("PresenceConstellationField");
    expect(s).toContain("LivingUniverseComposer");
  });

  it("removes legacy prototype layers", () => {
    const s = runtime();

    expect(s).not.toContain("lumaspace-worlds-layer");
    expect(s).not.toContain("lumaspace-pulse-layer");
    expect(s).not.toContain("lumaspace-garden-layer");
    expect(s).not.toContain("lumaspace-story-constellation");
    expect(s).not.toContain("lumaspace-reaction-galaxy");
    expect(s).not.toContain("lumaspace-runtime-center");
  });

  it("removes competing old feature components", () => {
    const s = runtime();

    expect(s).not.toContain("LivingGlassWorlds");
    expect(s).not.toContain("LivingYouStar");
    expect(s).not.toContain("MoodGarden");
    expect(s).not.toContain("ReactionGalaxy");
    expect(s).not.toContain("MemoryCivilization");
    expect(s).not.toContain("NexaCompanion");
    expect(s).not.toContain("SovereignUniverse");
  });
});
