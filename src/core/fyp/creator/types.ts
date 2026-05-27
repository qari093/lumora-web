export type CreatorTier =
  | "seed"
  | "rising"
  | "verified"
  | "elite";

export interface CreatorProfile {
  id: string;
  handle: string;
  tier: CreatorTier;
  reputation: number;
  verified: boolean;
}

export interface CreatorRuntimeState {
  active: boolean;
  creators: CreatorProfile[];
}
