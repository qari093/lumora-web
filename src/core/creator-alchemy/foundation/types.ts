export type CreatorAlchemyRuleId =
  | "emotional_truth"
  | "scarcity"
  | "usability_first"
  | "fluid_identity"
  | "human_economy"
  | "non_invasive"
  | "emotional_density"
  | "creator_agency";

export type ResonanceSignal =
  | "rewatch"
  | "linger"
  | "save"
  | "completion"
  | "quiet_gift"
  | "constellation_affinity"
  | "creator_curiosity";

export type EmotionalRisk =
  | "fake_poetry"
  | "ritual_overload"
  | "surveillance_feel"
  | "casino_mechanics"
  | "identity_lock"
  | "burnout_pressure"
  | "usability_friction";

export type SymbolicMoment =
  | "seed_sleeping"
  | "seed_growing"
  | "seed_blooming"
  | "quiet_lake"
  | "blooming_current"
  | "glowing_river"
  | "resonant_tide";

export interface EmotionalDensityInput {
  majorInsights: number;
  atmospheres: number;
  symbolicMoments: number;
  creativeIntensity?: boolean;
}

export interface EmotionalDensityResult {
  ok: boolean;
  maxInsights: number;
  reason: string;
}

export interface CreatorAgencyState {
  canOptOut: boolean;
  canRejectSymbol: boolean;
  canLowerIntensity: boolean;
  canEnterSanctuary: boolean;
}
