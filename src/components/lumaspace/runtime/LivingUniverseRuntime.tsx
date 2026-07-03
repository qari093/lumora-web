"use client";

import { useEffect } from "react";
import "@/src/styles/lumaspace/living-universe.css";
import HomecomingRitualOmega from "@/src/components/lumaspace/homecoming/HomecomingRitualOmega";
import LumaAtmosphereEngine from "@/src/components/lumaspace/atmosphere/LumaAtmosphereEngine";
import EnvironmentalWorldEffects from "@/src/components/lumaspace/worlds/EnvironmentalWorldEffects";
import PresenceConstellationField from "@/src/components/lumaspace/presence/PresenceConstellationField";
import LivingUniverseComposer from "@/src/components/lumaspace/universe/LivingUniverseComposer";
import InteractionMotionField from "@/src/components/lumaspace/interaction/InteractionMotionField";
import LivingWorldIdentitiesLayer from "@/src/components/lumaspace/experience/LivingWorldIdentitiesLayer";
import AmbientPresenceEvolutionLayer from "@/src/components/lumaspace/experience/AmbientPresenceEvolutionLayer";

export default function LivingUniverseRuntime() {
  useEffect(() => {
    document.body.classList.add("lumora-lumaspace-route");
    return () => document.body.classList.remove("lumora-lumaspace-route");
  }, []);

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
        <LivingWorldIdentitiesLayer />
        <PresenceConstellationField />
        <AmbientPresenceEvolutionLayer />
        <InteractionMotionField />
        <LivingUniverseComposer />
      </main>
    </>
  );
}
