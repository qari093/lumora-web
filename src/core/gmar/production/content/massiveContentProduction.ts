export type GmarContentMode =
  | "story"
  | "daily"
  | "weekly"
  | "seasonal"
  | "raid"
  | "ranked"
  | "sandbox";

export const gmarMassiveContentProduction = {
  missionGenerationPipeline: true,
  sideQuestProduction: true,
  dailyMissionSystem: true,
  weeklyChallengeSystem: true,
  seasonalChallengeSystem: true,
  eventQuestSystem: true,
  clanMissions: true,
  globalMissions: true,
  storyArcExpansion: true,
  loreExpansion: true,
  cinematicProductionPipeline: true,
  trailerProductionSystem: true,
  replayHighlightGeneration: true,
  dynamicEventScripting: true,
  dynamicModifiers: true,
  randomizedEncounters: true,
  rewardExpansion: true,
  cosmeticExpansion: true,
  achievementSystem: true,
  masterySystem: true,
  prestigeSystem: true,
  rankLadderExpansion: true,
  battlePassExpansion: true,
  creatorChallengeSystem: true,
  communityEvents: true,
  ugcModerationFlow: true,
  creatorEconomyRewards: true,
  crossGameRewards: true,
  gmarWideProgression: true,
  cooperativeRaids: true,
  eliteRaids: true,
  endlessSurvivalMode: true,
  rankedPvpModes: true,
  casualPvpModes: true,
  tournamentModes: true,
  trainingGrounds: true,
  sandboxMode: true,
  spectatorModePolish: true,
  replaySystemExpansion: true,
  finalSeal: true
} as const;

export const gmarContentModes: GmarContentMode[] = [
  "story",
  "daily",
  "weekly",
  "seasonal",
  "raid",
  "ranked",
  "sandbox"
];

export function validateGmarMassiveContentProduction() {
  return Object.values(gmarMassiveContentProduction).every(Boolean) && gmarContentModes.length === 7;
}

export function estimateMissionVolume(baseMissions: number, modifiers: number) {
  return {
    totalVariants: Math.max(baseMissions, baseMissions * Math.max(1, modifiers)),
    scalable: baseMissions >= 50 && modifiers >= 3
  };
}

export function resolveContentMode(mode: GmarContentMode) {
  const competitive = mode === "ranked" || mode === "raid";
  const repeatable = mode !== "story";

  return {
    mode,
    competitive,
    repeatable,
    rewardsEnabled: true
  };
}

export function validateUgcSubmission(input: { hasLicenseProof: boolean; safeRating: number; creatorId?: string }) {
  if (!input.creatorId) return { ok: false, reason: "creator_required" as const };
  if (!input.hasLicenseProof) return { ok: false, reason: "license_required" as const };
  if (input.safeRating < 80) return { ok: false, reason: "safety_threshold_failed" as const };

  return { ok: true, reason: "accepted" as const };
}

export function calculateReplayHighlightScore(input: { skill: number; rarity: number; teamwork: number }) {
  return Math.round(input.skill * 0.45 + input.rarity * 0.35 + input.teamwork * 0.2);
}
