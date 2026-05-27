export const FYP94_LIMITS = {
  minDuration: 3,
  maxDuration: 60,
  maxSizeBytes: 8 * 1024 * 1024,
  maxWidth: 720,
  maxHeight: 1280,
};

export function validateLimits(item: any) {
  return (
    item.duration >= FYP94_LIMITS.minDuration &&
    item.duration <= FYP94_LIMITS.maxDuration &&
    item.sizeBytes <= FYP94_LIMITS.maxSizeBytes &&
    item.width <= FYP94_LIMITS.maxWidth &&
    item.height <= FYP94_LIMITS.maxHeight
  );
}
