export type Fyp94StorageMode = "local" | "r2";

export function getFyp94StorageMode(): Fyp94StorageMode {
  return process.env.FYP94_STORAGE_MODE === "r2" ? "r2" : "local";
}

export function getFyp94CdnBaseUrl(): string {
  return (process.env.FYP94_CDN_BASE_URL || "").replace(/\/$/, "");
}

export function mapFyp94CdnPlaybackUrl(localUrl: string): string {
  const mode = getFyp94StorageMode();
  const cdnBaseUrl = getFyp94CdnBaseUrl();

  if (mode !== "r2") return localUrl;
  if (!cdnBaseUrl) return localUrl;

  return `${cdnBaseUrl}${localUrl.startsWith("/") ? localUrl : `/${localUrl}`}`;
}

export function validateFyp94ProductionConfig() {
  const mode = getFyp94StorageMode();
  const cdnBaseUrl = getFyp94CdnBaseUrl();

  return {
    ok: mode === "local" || Boolean(cdnBaseUrl),
    storageMode: mode,
    cdnConfigured: Boolean(cdnBaseUrl),
    fallbackLocal: mode === "local" || !cdnBaseUrl,
  };
}
