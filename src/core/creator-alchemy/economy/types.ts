export type QuietGiftType = "candle" | "leaf" | "echo" | "lantern" | "star";

export type EconomyStage = "symbolic" | "utility" | "fiat_ready";

export type ResonanceLedgerState =
  | "quiet_lake"
  | "blooming_current"
  | "glowing_river"
  | "resonant_tide";

export interface QuietGift {
  id: string;
  type: QuietGiftType;
  creatorId: string;
  viewerId: string;
  createdAt: string;
  silentCoinsValue: number;
}

export interface EconomyMaturityInput {
  monthlyActiveCreators: number;
  monthlyActiveUsers: number;
  antiFraudReady: boolean;
  moderationStable: boolean;
  creatorCultureStable: boolean;
}

export interface EconomyMaturityResult {
  stage: EconomyStage;
  fiatBridgeAllowed: boolean;
  reasons: string[];
}

export interface ResonanceLedger {
  creatorId: string;
  resonanceEnergy: number;
  state: ResonanceLedgerState;
  horizonProgress: number;
}

export interface ResonanceGarden {
  creatorId: string;
  plants: number;
  trees: number;
  rareBlooms: number;
}

export interface ResonanceWindowDecision {
  allowed: boolean;
  durationHours: number;
  audienceExpansion: number;
  reason: string;
}
