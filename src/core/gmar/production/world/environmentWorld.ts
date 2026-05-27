export type GmarBiome =
  | "desert"
  | "ice"
  | "jungle"
  | "space"
  | "ruins"
  | "neon"
  | "underground"
  | "storm"
  | "dream";

export const gmarWorldProduction = {
  coreBiomeProduction: true,
  biomeExpansion: true,
  dynamicWeatherSystem: true,
  timeOfDaySystem: true,
  environmentalHazards: true,
  interactiveObjects: true,
  destructionLayer: true,
  dynamicFogSystem: true,
  atmosphericParticles: true,
  terrainStreaming: true,
  worldEventTriggers: true,
  navigationMeshExpansion: true,
  ambientNpcRoutines: true,
  wildlifeSystems: true,
  storytellingProps: true,
  hiddenExplorationZones: true,
  puzzleZones: true,
  bossArenas: true,
  parkourRoutes: true,
  traversalSystems: true,
  environmentalSoundZones: true,
  dynamicAmbientMusic: true,
  crowdSimulation: true,
  portalTransitions: true,
  worldMapRendering: true,
  miniMapSystem: true,
  landmarkSystem: true,
  secretContentSystem: true,
  explorationRewardLayer: true,
  performanceOptimization: true,
  memoryOptimization: true,
  finalSeal: true
} as const;

export const gmarBiomes: GmarBiome[] = [
  "desert",
  "ice",
  "jungle",
  "space",
  "ruins",
  "neon",
  "underground",
  "storm",
  "dream"
];

export function validateGmarWorldProduction() {
  return Object.values(gmarWorldProduction).every(Boolean) && gmarBiomes.length >= 9;
}

export function resolveBiomeHazard(biome: GmarBiome) {
  const hazards: Record<GmarBiome, string> = {
    desert: "heat_wave",
    ice: "slip_freeze",
    jungle: "poison_growth",
    space: "low_gravity",
    ruins: "collapse_trap",
    neon: "signal_distortion",
    underground: "darkness_pressure",
    storm: "lightning_surge",
    dream: "reality_shift"
  };

  return hazards[biome];
}

export function calculateWorldStreamingBudget(activeBiomes: number) {
  return {
    shardCount: Math.max(1, Math.ceil(activeBiomes / 3)),
    memorySafe: activeBiomes <= 9,
    prefetchRadius: activeBiomes >= 6 ? 2 : 1
  };
}

export function createExplorationReward(secretFound: boolean, difficulty: number) {
  return {
    eligible: secretFound,
    rewardScore: secretFound ? Math.max(10, difficulty * 25) : 0
  };
}
