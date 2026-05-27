export type EchoType =
  | "first_light"
  | "sync"
  | "redemption"
  | "sacrifice"
  | "last_breath"
  | "vanishing"
  | "lament"
  | "civilization";

export type EchoTelemetry = {
  nearFailureDeltaMs: number;
  coordinationScore: number;
  rarityPercent: number;
  emotionalArcQuality: number;
  socialAcknowledgmentScore: number;
};

export type EchoCandidate = {
  score: number;
  eligible: boolean;
  type: EchoType;
  reasons: string[];
};
