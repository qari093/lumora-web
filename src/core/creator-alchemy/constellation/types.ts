export type ConstellationId =
  | "midnight_souls"
  | "quiet_chaos"
  | "neon_dreamers"
  | "healing_humor"
  | "slow_fire"
  | "restless_voices";

export type DriftReason = "tone_shift" | "audience_mutation" | "creator_curiosity";

export interface ConstellationProfile {
  id: ConstellationId;
  name: string;
  atmosphere: string;
  opposite: ConstellationId;
}

export interface CreatorConstellationState {
  creatorId: string;
  current: ConstellationId;
  ancestral: ConstellationId;
  toneShift: number;
  audienceMutation: number;
  creatorCuriosity: number;
}

export interface DriftDecision {
  shouldDrift: boolean;
  reasons: DriftReason[];
  driftStrength: number;
  suggestedExposure: number;
}

export interface SilentCollaborationCandidate {
  creatorA: string;
  creatorB: string;
  sharedConstellation: ConstellationId;
  compatibility: number;
  allowed: boolean;
}

export interface DreamChamberState {
  active: boolean;
  preGlow: boolean;
  likesHidden: boolean;
  commentsHidden: boolean;
  presenceOnly: boolean;
}

export interface BridgeEvent {
  active: boolean;
  from: ConstellationId;
  to: ConstellationId;
  anonymous: boolean;
  labelHidden: boolean;
}
