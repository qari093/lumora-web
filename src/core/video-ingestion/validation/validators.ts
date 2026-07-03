import type { CanonicalVideoAsset } from "../runtime";
import type {
  MediaValidationPolicy,
  MediaValidationStage,
  MediaValidationStageResult,
} from "./types";
import { createMediaValidationIssue } from "./issues";

function stage(
  stage: MediaValidationStage,
  issues: MediaValidationStageResult["issues"],
): MediaValidationStageResult {
  return {
    stage,
    issues,
    ok: !issues.some((issue) => issue.severity === "fatal" || issue.severity === "error"),
  };
}

export function validateMediaIdentity(asset: CanonicalVideoAsset) {
  return stage("identity", [
    ...(!asset.id ? [createMediaValidationIssue("missing_id", "fatal", "Asset id is required.", "id")] : []),
    ...(!asset.providerId ? [createMediaValidationIssue("missing_provider", "fatal", "Provider id is required.", "providerId")] : []),
    ...(!asset.sourceAssetId ? [createMediaValidationIssue("missing_source_asset", "fatal", "Source asset id is required.", "sourceAssetId")] : []),
  ]);
}

export function validateMediaSource(asset: CanonicalVideoAsset) {
  return stage("source", [
    ...(!asset.sourceUrl.startsWith("https://") && !asset.sourceUrl.startsWith("lumora://")
      ? [createMediaValidationIssue("unsafe_source_url", "fatal", "Source URL must be https or lumora protocol.", "sourceUrl")]
      : []),
    ...(!asset.checksum ? [createMediaValidationIssue("missing_checksum", "error", "Checksum is required.", "checksum")] : []),
  ]);
}

export function validateMediaLicense(asset: CanonicalVideoAsset, policy: MediaValidationPolicy) {
  return stage("license", [
    ...(policy.requireCommercialUse && !asset.license.commercialUse
      ? [createMediaValidationIssue("commercial_use_not_allowed", "fatal", "Commercial use is required.", "license")]
      : []),
    ...(policy.requireAttribution && asset.license.attributionRequired && !asset.attribution.trim()
      ? [createMediaValidationIssue("missing_attribution", "error", "Attribution is required.", "attribution")]
      : []),
    ...(!asset.license.sourceUrl
      ? [createMediaValidationIssue("missing_license_source", "fatal", "License source URL is required.", "license.sourceUrl")]
      : []),
  ]);
}

export function validateMediaAudio(asset: CanonicalVideoAsset, policy: MediaValidationPolicy) {
  return stage("audio", [
    ...(policy.requireAudio && !asset.hasAudio
      ? [createMediaValidationIssue("audio_required", "fatal", "Audio track is required.", "hasAudio")]
      : []),
  ]);
}

export function validateMediaVideo(asset: CanonicalVideoAsset, policy: MediaValidationPolicy) {
  return stage("video", [
    ...(asset.width < policy.minWidth
      ? [createMediaValidationIssue("width_too_low", "error", "Video width is below policy minimum.", "width")]
      : []),
    ...(asset.height < policy.minHeight
      ? [createMediaValidationIssue("height_too_low", "error", "Video height is below policy minimum.", "height")]
      : []),
    ...(!policy.allowedMimeTypes.includes(asset.mimeType)
      ? [createMediaValidationIssue("mime_type_not_allowed", "fatal", "Video MIME type is not allowed.", "mimeType")]
      : []),
  ]);
}

export function validateMediaDuration(asset: CanonicalVideoAsset, policy: MediaValidationPolicy) {
  return stage("duration", [
    ...(asset.durationSeconds < policy.minDurationSeconds
      ? [createMediaValidationIssue("duration_too_short", "error", "Video duration is below policy minimum.", "durationSeconds")]
      : []),
    ...(asset.durationSeconds > policy.maxDurationSeconds
      ? [createMediaValidationIssue("duration_too_long", "error", "Video duration exceeds policy maximum.", "durationSeconds")]
      : []),
  ]);
}

export function validateMediaMetadata(asset: CanonicalVideoAsset) {
  return stage("metadata", [
    ...(!asset.title.trim()
      ? [createMediaValidationIssue("missing_title", "fatal", "Title is required.", "title")]
      : []),
    ...(asset.tags.length === 0
      ? [createMediaValidationIssue("missing_tags", "warning", "Tags improve discovery.", "tags")]
      : []),
  ]);
}
