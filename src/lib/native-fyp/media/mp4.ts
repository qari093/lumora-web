const ALLOWED_VIDEO_MIME = new Set([
  "video/mp4",
  "video/quicktime",
]);

export function isAcceptedNativeFypVideoMime(mime: string): boolean {
  return ALLOWED_VIDEO_MIME.has(mime);
}

export function assertAcceptedNativeFypVideoMime(mime: string): void {
  if (!isAcceptedNativeFypVideoMime(mime)) {
    throw new Error(`Unsupported native FYP video MIME: ${mime}`);
  }
}
