const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "video/mp4", "audio/mpeg", "application/pdf"];

export function validateUploadFile(input: { type: string; sizeBytes: number }) {
  const maxSize = 250 * 1024 * 1024;

  return {
    ok: ALLOWED_TYPES.includes(input.type) && input.sizeBytes > 0 && input.sizeBytes <= maxSize,
    allowedType: ALLOWED_TYPES.includes(input.type),
    allowedSize: input.sizeBytes > 0 && input.sizeBytes <= maxSize,
  };
}
