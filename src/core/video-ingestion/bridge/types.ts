import type { CanonicalVideoAsset } from "../runtime";

export type ValidationBridgeSurface =
  | "fyp"
  | "lumaspace"
  | "universal_share"
  | "voice_check";

export type ValidationBridgeStep = {
  id: string;
  surface: ValidationBridgeSurface;
  passed: boolean;
  detail: string;
};

export type FypLumaSpaceValidationJourney = {
  id: string;
  assetId: string;
  providerId: string;
  asset: CanonicalVideoAsset;
  steps: ValidationBridgeStep[];
  passed: boolean;
};

export type ValidationBridgeSummary = {
  total: number;
  passed: number;
  failed: number;
  ready: boolean;
};
