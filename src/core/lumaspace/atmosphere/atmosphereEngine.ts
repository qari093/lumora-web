export type LumaAtmosphereLayer =
  | "NEBULA"
  | "STARFIELD"
  | "FOG"
  | "LIGHT"
  | "PARTICLES"
  | "BREATHING";

export const LumaAtmosphereEngine = Object.freeze({
  doctrine: "Atmosphere before interface.",
  layers: ["NEBULA", "STARFIELD", "FOG", "LIGHT", "PARTICLES", "BREATHING"] as LumaAtmosphereLayer[],
  serenity: {
    motionSpeed: "slow",
    maxPersistentText: 3,
    glowIntensity: "soft",
    particleDensity: "low",
    spectaclePolicy: "rare"
  },
  rhythm: {
    universeBreathSeconds: 12,
    youBreathSeconds: 6,
    nebulaDriftSeconds: 28,
    starDriftSeconds: 36
  },
  performance: {
    cssOnlyBase: true,
    noHeavyCanvasByDefault: true,
    reducedMotionSafe: true
  }
});

export function validateLumaAtmosphereEngine() {
  return (
    LumaAtmosphereEngine.layers.includes("NEBULA") &&
    LumaAtmosphereEngine.layers.includes("STARFIELD") &&
    LumaAtmosphereEngine.layers.includes("BREATHING") &&
    LumaAtmosphereEngine.serenity.maxPersistentText <= 3 &&
    LumaAtmosphereEngine.performance.cssOnlyBase &&
    LumaAtmosphereEngine.performance.reducedMotionSafe
  );
}
