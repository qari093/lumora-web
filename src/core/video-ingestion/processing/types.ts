import type { CanonicalVideoAsset } from "../runtime";

export type ProcessingStage =
  | "download"
  | "stream_probe"
  | "thumbnail"
  | "preview"
  | "transcode"
  | "normalize"
  | "storage"
  | "rollback";

export type ProcessingStatus = "pending" | "running" | "complete" | "failed" | "skipped";

export type ProcessingStep = {
  id: string;
  stage: ProcessingStage;
  status: ProcessingStatus;
  inputAssetId: string;
  outputUrl?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
};

export type ProcessingPlan = {
  id: string;
  assetId: string;
  providerId: string;
  steps: ProcessingStep[];
  createdAt: string;
  updatedAt: string;
};

export type ProcessedVideoAsset = CanonicalVideoAsset & {
  processing: {
    planId: string;
    thumbnailUrl?: string;
    previewUrl?: string;
    normalizedUrl?: string;
    storageKey?: string;
    processedAt: string;
  };
};
