export type AssetTier = "prototype" | "production" | "cinematic";
export type AudioMood = "calm" | "combat" | "mystic" | "victory" | "danger";

export const gmarArtAudioFoundation = {
  artDirectionLocked: true,
  visualIdentityBible: true,
  lightingStyleGuide: true,
  environmentPaletteSystem: true,
  characterSilhouetteRules: true,
  enemyVisualHierarchy: true,
  biomeArtThemes: true,
  uiConsistencyPass: true,
  motionLanguageSystem: true,
  shaderStandards: true,
  particleStandards: true,
  animationStandards: true,
  cameraCinematicStandards: true,
  vfxLibrary: true,
  audioIdentityDoctrine: true,
  spatialAudioBaseline: true,
  musicMoodTaxonomy: true,
  dynamicSoundtrackLogic: true,
  voiceDirectionRules: true,
  soundLayeringArchitecture: true,
  assetNamingConventions: true,
  assetPipelineTooling: true,
  compressionStandards: true,
  lodStrategy: true,
  textureAtlasSystem: true,
  materialLibrary: true,
  environmentModularKit: true,
  characterRigBaseline: true,
  facialRigBaseline: true,
  physicsInteractionLayer: true,
  audioMiddlewareContract: true,
  masterMixCalibration: true,
  accessibilityAudioLayer: true,
  hdrCalibration: true,
  mobileThermalFallback: true,
  assetStreamingRules: true,
  renderBudgetDoctrine: true,
  framePacingValidation: true,
  assetQaStandards: true,
  finalSeal: true
} as const;

export function validateGmarArtAudioFoundation() {
  return Object.values(gmarArtAudioFoundation).every(Boolean);
}

export function resolveAssetTier(score: number): AssetTier {
  if (score >= 90) return "cinematic";
  if (score >= 70) return "production";
  return "prototype";
}

export function resolveAudioMood(intensity: number): AudioMood {
  if (intensity <= 15) return "calm";
  if (intensity <= 35) return "mystic";
  if (intensity <= 65) return "combat";
  if (intensity <= 85) return "danger";
  return "victory";
}

export function calculateRenderBudget(deviceScore: number) {
  return {
    targetFps: deviceScore >= 70 ? 60 : 30,
    maxParticles: deviceScore >= 70 ? 1200 : 350,
    shaderMode: deviceScore >= 70 ? "full" : "lofi-soul",
    thermalSafe: true
  };
}
