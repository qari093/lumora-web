export const FYP94_QUALITY_LIMITS = {
  minDurationSec: 3,
  maxDurationSec: 60,
  maxFileSizeBytes: 8 * 1024 * 1024,
  maxWidth: 720,
  maxHeight: 1280,
};

export type Fyp94QualityInput = {
  duration?: number;
  sizeBytes?: number;
  width?: number;
  height?: number;
};

export function validateFyp94Duration(input: Fyp94QualityInput) {
  const duration = Number(input.duration || 0);

  return {
    ok:
      duration >= FYP94_QUALITY_LIMITS.minDurationSec &&
      duration <= FYP94_QUALITY_LIMITS.maxDurationSec,
    reason:
      duration < FYP94_QUALITY_LIMITS.minDurationSec
        ? "duration_too_short"
        : duration > FYP94_QUALITY_LIMITS.maxDurationSec
          ? "duration_too_long"
          : null,
  };
}

export function validateFyp94FileSize(input: Fyp94QualityInput) {
  const sizeBytes = Number(input.sizeBytes || 0);

  return {
    ok: sizeBytes > 0 && sizeBytes <= FYP94_QUALITY_LIMITS.maxFileSizeBytes,
    reason:
      sizeBytes <= 0
        ? "missing_size"
        : sizeBytes > FYP94_QUALITY_LIMITS.maxFileSizeBytes
          ? "file_too_large"
          : null,
  };
}

export function validateFyp94Resolution(input: Fyp94QualityInput) {
  const width = Number(input.width || 0);
  const height = Number(input.height || 0);

  return {
    ok:
      width > 0 &&
      height > 0 &&
      width <= FYP94_QUALITY_LIMITS.maxWidth &&
      height <= FYP94_QUALITY_LIMITS.maxHeight &&
      height >= width,
    reason:
      width <= 0 || height <= 0
        ? "missing_resolution"
        : width > FYP94_QUALITY_LIMITS.maxWidth || height > FYP94_QUALITY_LIMITS.maxHeight
          ? "resolution_too_high"
          : height < width
            ? "not_vertical"
            : null,
  };
}
