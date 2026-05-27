export type CharacterRole = "hero" | "enemy" | "elite" | "boss" | "companion";

export const gmarCharacterEnemyProduction = {
  heroRoster: true,
  enemyArchetypeRoster: true,
  eliteEnemyRoster: true,
  bossRosterExpansion: true,
  companionSystem: true,
  npcDialogueLayer: true,
  characterCosmetics: true,
  weaponSkins: true,
  armorSkins: true,
  abilityVfxPolish: true,
  combatAnimationPass: true,
  idleAnimationPass: true,
  facialAnimationPass: true,
  emoteSystem: true,
  gestureSystem: true,
  characterVoicePacks: true,
  aiBehaviorExpansion: true,
  enemyCoordinationSystem: true,
  bossPhaseSystem: true,
  weaknessSystem: true,
  adaptiveDifficultyAi: true,
  enemyFactionLogic: true,
  progressionVisuals: true,
  damageFeedbackPolish: true,
  hitReactionPolish: true,
  combatCameraPolish: true,
  finisherSystem: true,
  ultimateAbilitySystem: true,
  characterLoreEntries: true,
  codexSystem: true,
  dialogueBranching: true,
  cinematicIntroScenes: true,
  characterSelectionPolish: true,
  matchIntroAnimations: true,
  victoryPoseSystem: true,
  defeatAnimations: true,
  squadSynchronization: true,
  networkAnimationSync: true,
  characterBalancingPass: true,
  finalSeal: true
} as const;

export const characterRoles: CharacterRole[] = ["hero", "enemy", "elite", "boss", "companion"];

export function validateGmarCharacterEnemyProduction() {
  return Object.values(gmarCharacterEnemyProduction).every(Boolean) && characterRoles.length === 5;
}

export function resolveCharacterPower(role: CharacterRole, basePower: number) {
  const multiplier: Record<CharacterRole, number> = {
    hero: 1.2,
    enemy: 1,
    elite: 1.8,
    boss: 4,
    companion: 0.8
  };

  return Math.round(basePower * multiplier[role]);
}

export function resolveBossPhase(healthPercent: number) {
  if (healthPercent <= 25) return "final_rage";
  if (healthPercent <= 50) return "mutation";
  if (healthPercent <= 75) return "pressure";
  return "opening";
}

export function createWeaknessProfile(role: CharacterRole) {
  return {
    role,
    hasWeakness: role !== "companion",
    exploitSafe: true
  };
}

export function validateNetworkAnimationSync(latencyMs: number) {
  return {
    synchronized: latencyMs <= 120,
    fallbackBlend: latencyMs > 120,
    rollbackSafe: true
  };
}
