export function evaluateUploadAbuse(input: { sizeBytes: number; uploadsToday: number }) {
  const maxSize = 250 * 1024 * 1024;
  const maxDailyUploads = 100;

  return {
    allowed: input.sizeBytes > 0 && input.sizeBytes <= maxSize && input.uploadsToday <= maxDailyUploads,
    maxSize,
    maxDailyUploads,
  };
}
