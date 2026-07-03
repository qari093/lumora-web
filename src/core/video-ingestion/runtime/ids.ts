export function createStableVideoId(parts: string[]): string {
  const source = parts.join(":");
  let hash = 2166136261;

  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return `video_${(hash >>> 0).toString(36)}`;
}

export function createIngestionJobId(providerId: string, at = new Date().toISOString()): string {
  return `ingest_${createStableVideoId([providerId, at]).replace("video_", "")}`;
}
