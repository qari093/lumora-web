export type CreativeAssetInput = {
  creativeId?: string | null;
  vendorId?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  width?: number | null;
  height?: number | null;
  durationMs?: number | null;
};

export type CreativeAssetRecord = {
  creativeId: string;
  vendorId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  durationMs: number;
  assetType: "image" | "video";
};

export type CreativeAssetResult =
  | { ok: true; asset: CreativeAssetRecord }
  | { ok: false; reason: string };

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

export function validateCreativeAsset(
  input: CreativeAssetInput
): CreativeAssetResult {
  const creativeId = typeof input.creativeId === "string" ? input.creativeId.trim() : "";
  const vendorId = typeof input.vendorId === "string" ? input.vendorId.trim() : "";
  const filename = typeof input.filename === "string" ? input.filename.trim() : "";
  const mimeType = typeof input.mimeType === "string" ? input.mimeType.trim().toLowerCase() : "";
  const sizeBytes =
    typeof input.sizeBytes === "number" && Number.isFinite(input.sizeBytes)
      ? Math.trunc(input.sizeBytes)
      : NaN;
  const width =
    typeof input.width === "number" && Number.isFinite(input.width)
      ? Math.trunc(input.width)
      : NaN;
  const height =
    typeof input.height === "number" && Number.isFinite(input.height)
      ? Math.trunc(input.height)
      : NaN;
  const durationMs =
    typeof input.durationMs === "number" && Number.isFinite(input.durationMs)
      ? Math.trunc(input.durationMs)
      : 0;

  if (!creativeId) return { ok: false, reason: "missing_creative_id" };
  if (!vendorId) return { ok: false, reason: "missing_vendor_id" };
  if (!filename) return { ok: false, reason: "missing_filename" };
  if (!mimeType) return { ok: false, reason: "missing_mime_type" };
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return { ok: false, reason: "invalid_size_bytes" };
  if (!Number.isFinite(width) || width <= 0) return { ok: false, reason: "invalid_width" };
  if (!Number.isFinite(height) || height <= 0) return { ok: false, reason: "invalid_height" };

  const isImage = ALLOWED_IMAGE_TYPES.has(mimeType);
  const isVideo = ALLOWED_VIDEO_TYPES.has(mimeType);

  if (!isImage && !isVideo) return { ok: false, reason: "unsupported_mime_type" };

  if (isImage) {
    if (sizeBytes > MAX_IMAGE_BYTES) return { ok: false, reason: "image_too_large" };
    if (durationMs !== 0) return { ok: false, reason: "image_duration_must_be_zero" };

    return {
      ok: true,
      asset: {
        creativeId,
        vendorId,
        filename,
        mimeType,
        sizeBytes,
        width,
        height,
        durationMs: 0,
        assetType: "image",
      },
    };
  }

  if (sizeBytes > MAX_VIDEO_BYTES) return { ok: false, reason: "video_too_large" };
  if (durationMs <= 0) return { ok: false, reason: "invalid_video_duration" };

  return {
    ok: true,
    asset: {
      creativeId,
      vendorId,
      filename,
      mimeType,
      sizeBytes,
      width,
      height,
      durationMs,
      assetType: "video",
    },
  };
}
