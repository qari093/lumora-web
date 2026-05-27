export type RitualLegacyType =
  | "one_time_mirror"
  | "mirror_chamber"
  | "lumora_letter"
  | "voice_will"
  | "legacy_trail"
  | "memorial_garden"
  | "fading_lamp";

export interface RitualRuntimeInput {
  creatorId: string;
  type: RitualLegacyType;
  daysSinceLastShown: number;
  creatorConsented: boolean;
  emotionalOverload: boolean;
}

export interface RitualRuntimeDecision {
  allowed: boolean;
  type: RitualLegacyType;
  reason: string;
}

export interface VoiceWillRuntime {
  creatorId: string;
  enabled: boolean;
  selectedWorks: string[];
  approved: boolean;
}

export interface MemorialGardenRuntime {
  creatorId: string;
  active: boolean;
  monetized: false;
  verifiedConsent: boolean;
}
