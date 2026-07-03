import type { CanonicalVideoAsset } from "../runtime";

export type EmotionalLane =
  | "serenity"
  | "wonder"
  | "spectacle"
  | "memory"
  | "learning"
  | "connection";

export type EmotionalFingerprint = {
  assetId: string;
  providerId: string;
  dominantLane: EmotionalLane;
  serenity: number;
  wonder: number;
  spectacle: number;
  memory: number;
  learning: number;
  connection: number;
  motionIntensity: number;
  contrastIntensity: number;
  audioEnergy: number;
  silenceRatio: number;
  colorTemperature: "cool" | "neutral" | "warm";
  safeForCalmMode: boolean;
};

export type EmotionalFingerprintInput = {
  asset: CanonicalVideoAsset;
  motionIntensity?: number;
  contrastIntensity?: number;
  audioEnergy?: number;
  silenceRatio?: number;
  colorTemperature?: "cool" | "neutral" | "warm";
};
