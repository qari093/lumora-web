import type { CanonicalVideoAsset } from "../runtime";
import { hasBlockingValidationIssue, hasFatalValidationIssue } from "./issues";
import { createDefaultMediaValidationPolicy } from "./policy";
import type {
  MediaValidationPolicy,
  MediaValidationReport,
  MediaValidationStageResult,
} from "./types";
import {
  validateMediaAudio,
  validateMediaDuration,
  validateMediaIdentity,
  validateMediaLicense,
  validateMediaMetadata,
  validateMediaSource,
  validateMediaVideo,
} from "./validators";

export function createMediaValidationReport(
  asset: CanonicalVideoAsset,
  policy: MediaValidationPolicy = createDefaultMediaValidationPolicy(),
): MediaValidationReport {
  const stages: MediaValidationStageResult[] = [
    validateMediaIdentity(asset),
    validateMediaSource(asset),
    validateMediaLicense(asset, policy),
    validateMediaAudio(asset, policy),
    validateMediaVideo(asset, policy),
    validateMediaDuration(asset, policy),
    validateMediaMetadata(asset),
  ];

  const issues = stages.flatMap((stage) => stage.issues);
  const blocking = hasBlockingValidationIssue(issues);
  const fatal = hasFatalValidationIssue(issues);
  const passedStages = stages.filter((stage) => stage.ok).length;
  const score = Number((passedStages / Math.max(1, stages.length)).toFixed(4));

  return {
    assetId: asset.id,
    providerId: asset.providerId,
    ok: !blocking,
    fatal,
    score,
    stages,
    issues,
  };
}

export function approveValidatedMediaAsset(asset: CanonicalVideoAsset, report: MediaValidationReport) {
  if (!report.ok) {
    return {
      ...asset,
      lifecycle: "quarantined" as const,
      updatedAt: new Date().toISOString(),
      metadata: {
        ...asset.metadata,
        validationScore: report.score,
        validationIssues: report.issues.map((issue) => issue.code),
      },
    };
  }

  return {
    ...asset,
    lifecycle: "validated" as const,
    updatedAt: new Date().toISOString(),
    metadata: {
      ...asset.metadata,
      validationScore: report.score,
      validationIssues: [],
    },
  };
}
