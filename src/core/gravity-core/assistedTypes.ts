import type { GravityIntentResult } from "./types";

export type GravityAssistedStage =
  | "disabled"
  | "observing"
  | "candidate"
  | "ready_to_assist"
  | "assist_preview"
  | "assist_confirmed"
  | "blocked";

export type GravityAssistedDecision = {
  integrated: boolean;
  enabled: boolean;
  stage: GravityAssistedStage;
  canRevealPortal: boolean;
  canSuggestReturn: boolean;
  canNavigate: boolean;
  confidence: number;
  reason: string;
};

export type GravityAssistedInput = {
  intent: GravityIntentResult;
  assistedEnabled: boolean;
  rolloutAllowed?: boolean;
  conflictActive?: boolean;
  fallbackAvailable?: boolean;
  telemetryHealthy?: boolean;
};
