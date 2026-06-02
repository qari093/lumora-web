import type { GravityMode, GravityThresholds } from "./types";

export const GRAVITY_CORE_FEATURE_FLAG = "GRAVITY_CORE_SHADOW";

export const DEFAULT_GRAVITY_MODE: GravityMode = "shadow";

export const DEFAULT_GRAVITY_THRESHOLDS: GravityThresholds = {
  proximityPx: 160,
  velocityIntent: 0.9,
  intentThreshold: 0.72,
  confidenceThreshold: 0.86,
  repetitionBoost: 0.08,
  hesitationBoost: 0.06,
  conflictPenalty: 0.25,
};

export function isGravityCoreShadowEnabled(env: Record<string, string | undefined> = process.env): boolean {
  const value = env.NEXT_PUBLIC_GRAVITY_CORE_SHADOW ?? env.GRAVITY_CORE_SHADOW;
  if (value === undefined) return true;
  return value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "shadow";
}
