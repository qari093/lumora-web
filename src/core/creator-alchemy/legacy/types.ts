export type LegacyStatus = "none" | "voice_will_enabled" | "memorial_verified";
export type LegacyGesture = "remembrance_flower" | "quiet_honor" | "soft_echo";

export interface LegacyTrailPolicy {
  creatorId: string;
  allowedWorkIds: string[];
  blockedWorkIds: string[];
}

export interface VoiceWill {
  creatorId: string;
  enabled: boolean;
  selectedWorkIds: string[];
  approvedAt?: string;
}

export interface MemorialRequest {
  creatorId: string;
  creatorApproved: boolean;
  verifiedFamilyApproval: boolean;
  verificationNotes?: string;
}

export interface MemorialGardenState {
  active: boolean;
  status: LegacyStatus;
  monetized: false;
  allowedGestures: LegacyGesture[];
}

export interface LumoraLetterInput {
  creatorId: string;
  anniversaryEligible: boolean;
  anonymousLines: string[];
}

export interface LumoraLetter {
  eligible: boolean;
  creatorId: string;
  lines: string[];
}

export interface FadingLamp {
  shown: boolean;
  message: string;
  blocksExit: false;
}
