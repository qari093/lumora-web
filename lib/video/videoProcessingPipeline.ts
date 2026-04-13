export type VideoProcessingStatus =
  | "uploaded"
  | "queued"
  | "processing"
  | "ready"
  | "failed";

export type VideoAsset = {
  id: string;
  creatorId: string;
  sourceUrl: string;
  mimeType: string;
  durationSec: number;
  status: VideoProcessingStatus;
  createdAt: number;
};

export type PipelineDecision =
  | {
      ok: true;
      nextStatus: VideoProcessingStatus;
      jobType: "transcode" | "thumbnail" | "finalize";
      lockKey: string;
    }
  | {
      ok: false;
      error:
        | "invalid_asset"
        | "unsupported_mime_type"
        | "invalid_duration"
        | "invalid_status_transition";
    };

const SUPPORTED_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

export function lockVideoProcessingPipeline(
  asset: VideoAsset
): PipelineDecision {
  if (!asset?.id || !asset.creatorId || !asset.sourceUrl) {
    return { ok: false, error: "invalid_asset" };
  }

  if (!SUPPORTED_VIDEO_TYPES.has(asset.mimeType)) {
    return { ok: false, error: "unsupported_mime_type" };
  }

  if (!Number.isFinite(asset.durationSec) || asset.durationSec <= 0 || asset.durationSec > 60 * 60) {
    return { ok: false, error: "invalid_duration" };
  }

  if (asset.status === "uploaded") {
    return {
      ok: true,
      nextStatus: "queued",
      jobType: "transcode",
      lockKey: `video:${asset.id}:queued`
    };
  }

  if (asset.status === "queued") {
    return {
      ok: true,
      nextStatus: "processing",
      jobType: "thumbnail",
      lockKey: `video:${asset.id}:processing`
    };
  }

  if (asset.status === "processing") {
    return {
      ok: true,
      nextStatus: "ready",
      jobType: "finalize",
      lockKey: `video:${asset.id}:ready`
    };
  }

  return { ok: false, error: "invalid_status_transition" };
}
