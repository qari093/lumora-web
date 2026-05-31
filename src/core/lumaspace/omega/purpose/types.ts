export type PurposeMode =
  | "collaboration"
  | "learning_partner"
  | "builder_partner"
  | "accountability_partner"
  | "mission_partner";

export type SkillSignal = {
  id: string;
  citizenId: string;
  skill: string;
  level: "beginner" | "intermediate" | "advanced" | "guardian";
  offering: boolean;
  seeking: boolean;
};

export type PurposeProfile = {
  citizenId: string;
  modes: PurposeMode[];
  skills: SkillSignal[];
  missionDomains: string[];
  availability: "low" | "medium" | "high";
  consentGranted: boolean;
};

export type PurposeMatch = {
  id: string;
  citizenA: string;
  citizenB: string;
  mode: PurposeMode;
  matchScore: number;
  sharedDomains: string[];
  complementarySkills: string[];
};

export type PurposeMission = {
  id: string;
  matchId: string;
  title: string;
  durationDays: number;
  progress: number;
  sharedMemoryId?: string;
};

export type PurposeReward = {
  id: string;
  missionId: string;
  citizenIds: [string, string];
  rewardKind: "shared_memory" | "tree_bloom" | "zencoin_micro_reward";
  unlocked: boolean;
};
