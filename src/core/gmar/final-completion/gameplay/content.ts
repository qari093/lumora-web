export type GmarMissionTier = "daily" | "weekly" | "story" | "event";
export type GmarDifficulty = "easy" | "normal" | "hard" | "elite";

export type GmarMissionDefinition = {
  missionId: string;
  tier: GmarMissionTier;
  title: string;
  objective: string;
  difficulty: GmarDifficulty;
  xpReward: number;
  zencoinReward: number;
  requiredLevel: number;
};

export type GmarProgressionCurve = {
  level: number;
  requiredXp: number;
  unlock: string;
};

export const GMAR_MISSION_REGISTRY: GmarMissionDefinition[] = [
  {
    missionId: "daily_origin_signal",
    tier: "daily",
    title: "Daily Origin Signal",
    objective: "Stabilize one signal inside the Origin Gate.",
    difficulty: "easy",
    xpReward: 20,
    zencoinReward: 3,
    requiredLevel: 1
  },
  {
    missionId: "story_first_gate",
    tier: "story",
    title: "The First Gate",
    objective: "Complete the first GMAR story objective.",
    difficulty: "normal",
    xpReward: 50,
    zencoinReward: 5,
    requiredLevel: 1
  },
  {
    missionId: "event_origin_storm",
    tier: "event",
    title: "Origin Storm Response",
    objective: "Join the Origin Storm and finish one event action.",
    difficulty: "normal",
    xpReward: 60,
    zencoinReward: 8,
    requiredLevel: 1
  },
  {
    missionId: "weekly_squad_sync",
    tier: "weekly",
    title: "Squad Sync",
    objective: "Complete one shared squad objective.",
    difficulty: "hard",
    xpReward: 120,
    zencoinReward: 12,
    requiredLevel: 2
  }
];

export const GMAR_PROGRESSION_CURVE: GmarProgressionCurve[] = [
  { level: 1, requiredXp: 0, unlock: "Origin Gate" },
  { level: 2, requiredXp: 100, unlock: "Squad Missions" },
  { level: 3, requiredXp: 250, unlock: "Event Challenges" },
  { level: 4, requiredXp: 500, unlock: "Creator Missions" },
  { level: 5, requiredXp: 900, unlock: "Elite Encounters" }
];

export function getGmarMission(missionId: string): GmarMissionDefinition {
  const mission = GMAR_MISSION_REGISTRY.find(item => item.missionId === missionId);

  if (!mission) {
    throw new Error("GMAR mission definition not found.");
  }

  return mission;
}

export function getAvailableGmarMissions(level: number): GmarMissionDefinition[] {
  if (!Number.isInteger(level) || level < 1) {
    throw new Error("GMAR mission availability requires valid level.");
  }

  return GMAR_MISSION_REGISTRY.filter(mission => mission.requiredLevel <= level);
}

export function calculateGmarLevelFromXp(xp: number): number {
  if (!Number.isInteger(xp) || xp < 0) {
    throw new Error("GMAR XP must be non-negative.");
  }

  return GMAR_PROGRESSION_CURVE
    .filter(entry => xp >= entry.requiredXp)
    .at(-1)?.level ?? 1;
}

export function assertGmarGameplayContent(): true {
  if (
    GMAR_MISSION_REGISTRY.length < 4 ||
    GMAR_PROGRESSION_CURVE.length < 5 ||
    getAvailableGmarMissions(1).length < 3 ||
    calculateGmarLevelFromXp(250) < 3
  ) {
    throw new Error("Invalid GMAR gameplay content.");
  }

  return true;
}
