import type { CanonicalVideoAsset } from "../runtime";

export type MediaValidationSeverity = "info" | "warning" | "error" | "fatal";

export type MediaValidationIssue = {
  code: string;
  severity: MediaValidationSeverity;
  message: string;
  field?: keyof CanonicalVideoAsset | string;
};

export type MediaValidationStage =
  | "identity"
  | "source"
  | "license"
  | "audio"
  | "video"
  | "duration"
  | "metadata"
  | "quality";

export type MediaValidationStageResult = {
  stage: MediaValidationStage;
  ok: boolean;
  issues: MediaValidationIssue[];
};

export type MediaValidationReport = {
  assetId: string;
  providerId: string;
  ok: boolean;
  fatal: boolean;
  score: number;
  stages: MediaValidationStageResult[];
  issues: MediaValidationIssue[];
};

export type MediaValidationPolicy = {
  minDurationSeconds: number;
  maxDurationSeconds: number;
  minWidth: number;
  minHeight: number;
  requireAudio: boolean;
  allowedMimeTypes: string[];
  requireCommercialUse: boolean;
  requireAttribution: boolean;
};
