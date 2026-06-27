"use client";

import "@/src/styles/lumaspace/living-universe.css";
import HomecomingRitualOmega from "@/src/components/lumaspace/homecoming/HomecomingRitualOmega";
import LumaAtmosphereEngine from "@/src/components/lumaspace/atmosphere/LumaAtmosphereEngine";
import EnvironmentalWorldEffects from "@/src/components/lumaspace/worlds/EnvironmentalWorldEffects";
import PresenceConstellationField from "@/src/components/lumaspace/presence/PresenceConstellationField";
import LivingUniverseComposer from "@/src/components/lumaspace/universe/LivingUniverseComposer";

export default function LivingUniverseRuntime() {
  return (
    <>
      <HomecomingRitualOmega />

      <main
        data-testid="lumaspace-living-universe-runtime"
        className="lumaspace-runtime-shell"
        aria-label="LumaSpace Living Universe"
      >
        <LumaAtmosphereEngine />
        <EnvironmentalWorldEffects />
        <PresenceConstellationField />
        <LivingUniverseComposer />
      </main>
    </>
  );
}
