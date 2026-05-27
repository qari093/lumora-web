export const ARCHIVE_QUALITY_RULES = {
  minDurationSec: 8,
  maxDurationSec: 45,
  minMotionHint: 0.2,
  minFileSizeBytes: 120_000,
};

export function passesArchiveDuration(item: any): boolean {
  const duration = Number(item.duration || item.length || 0);
  return duration >= ARCHIVE_QUALITY_RULES.minDurationSec && duration <= ARCHIVE_QUALITY_RULES.maxDurationSec;
}

export function hasArchiveMotionPresence(item: any): boolean {
  const text = `${item.title || ""} ${item.description || ""} ${item.query || ""}`.toLowerCase();
  const motionTerms = ["walking", "running", "dancing", "crowd", "street", "kids", "playing", "event", "parade", "traffic"];
  return Number(item.motionHint ?? 0.5) >= ARCHIVE_QUALITY_RULES.minMotionHint || motionTerms.some((term) => text.includes(term));
}

export function prefersArchiveHumanActivity(item: any): boolean {
  const text = `${item.title || ""} ${item.description || ""} ${item.query || ""}`.toLowerCase();
  return ["family", "kids", "crowd", "people", "street", "school", "wedding", "festival", "party"].some((term) => text.includes(term));
}

export function rejectsUnusableArchiveFootage(item: any): boolean {
  const size = Number(item.sizeBytes || item.fileSize || ARCHIVE_QUALITY_RULES.minFileSizeBytes);
  const text = `${item.title || ""} ${item.description || ""}`.toLowerCase();
  return size < ARCHIVE_QUALITY_RULES.minFileSizeBytes || text.includes("corrupt") || text.includes("unusable");
}

export function allowControlledImperfection(item: any): boolean {
  const text = `${item.title || ""} ${item.description || ""}`.toLowerCase();
  return ["amateur", "home movie", "handheld", "raw", "archive", "old"].some((term) => text.includes(term));
}

export function passesArchiveQualityFilter(item: any): boolean {
  return (
    passesArchiveDuration(item) &&
    hasArchiveMotionPresence(item) &&
    !rejectsUnusableArchiveFootage(item)
  );
}
