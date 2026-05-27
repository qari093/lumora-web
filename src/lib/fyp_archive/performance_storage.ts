export const ARCHIVE_STORAGE_POLICY = {
  maxResolutionWidth: 720,
  maxResolutionHeight: 1280,
  maxClipBytes: 12 * 1024 * 1024,
  maxArchiveItems: 500,
};

export function needsArchiveConversion(item: any): boolean {
  const url = String(item.mp4Url || item.archiveFile || "").toLowerCase();
  return !(url.endsWith(".mp4") || url.includes(".mp4?"));
}

export function mapArchivePlaybackUrl(item: any, cdnBase = ""): string {
  const local = item.localUrl || item.mp4Url || "";
  if (!cdnBase) return local;

  return `${cdnBase.replace(/\/$/, "")}${String(local).startsWith("/") ? local : `/${local}`}`;
}

export function enforceArchiveStorageCap(items: any[], maxItems = ARCHIVE_STORAGE_POLICY.maxArchiveItems) {
  if (items.length <= maxItems) return items;
  return items.slice(items.length - maxItems);
}

export function passesArchiveResolution(item: any): boolean {
  const width = Number(item.width || ARCHIVE_STORAGE_POLICY.maxResolutionWidth);
  const height = Number(item.height || ARCHIVE_STORAGE_POLICY.maxResolutionHeight);

  return (
    width <= ARCHIVE_STORAGE_POLICY.maxResolutionWidth &&
    height <= ARCHIVE_STORAGE_POLICY.maxResolutionHeight
  );
}

export function validateArchiveFastLoad(item: any): boolean {
  const size = Number(item.sizeBytes || item.fileSize || 0);
  if (size <= 0) return true;
  return size <= ARCHIVE_STORAGE_POLICY.maxClipBytes;
}
