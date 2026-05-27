export type MythicEventType =
  | "one_time_mirror"
  | "mirror_chamber"
  | "first_light"
  | "one_night_sky"
  | "annual_symbol_constellation";

export type FirstLightPath = "community_influence" | "structural_originality";

export interface OneTimeMirrorInput {
  creatorId: string;
  monthsCompleted: number;
  acceptedSymbols: string[];
  quietReturns: number;
  totalLingerMinutes: number;
}

export interface OneTimeMirror {
  eligible: boolean;
  creatorId: string;
  symbols: string[];
  line: string;
}

export interface MirrorChamberSession {
  eligible: boolean;
  works: string[];
  metricsHidden: boolean;
  notificationsHidden: boolean;
  reflectionQuestion: string;
}

export interface FirstLightInput {
  creatorId: string;
  influencedConstellations: number;
  influencedCreators: number;
  structuralNoveltyMonths: number;
  safetyPassed: boolean;
}

export interface FirstLightDecision {
  eligible: boolean;
  path: FirstLightPath | null;
  reward: "symbolic_prestige" | "none";
  reason: string;
}

export interface OneNightSkyState {
  active: boolean;
  optional: boolean;
  blocksCoreUse: boolean;
  durationMinutes: number;
}
