export type GravityMode = "off" | "shadow" | "assisted" | "live";

export type GravityState =
  | "idle"
  | "watching"
  | "proximity"
  | "intent"
  | "confirmed"
  | "cancelled";

export type GravityDirection = "up" | "down" | "none";

export type GravityThresholds = {
  proximityPx: number;
  velocityIntent: number;
  intentThreshold: number;
  confidenceThreshold: number;
  repetitionBoost: number;
  hesitationBoost: number;
  conflictPenalty: number;
};

export type GravitySample = {
  scrollY: number;
  maxScrollY: number;
  timestamp: number;
  viewportHeight: number;
  documentHeight: number;
};

export type GravityRuntimeInput = {
  previous?: GravitySample;
  current: GravitySample;
  repeatedAttempts?: number;
  hesitationMs?: number;
  conflictActive?: boolean;
  reduceMotion?: boolean;
};

export type GravityIntentResult = {
  state: GravityState;
  direction: GravityDirection;
  velocity: number;
  proximity: number;
  intentScore: number;
  confidence: number;
  shadowOnly: boolean;
  shouldShowRing: boolean;
  shouldNavigate: boolean;
};
