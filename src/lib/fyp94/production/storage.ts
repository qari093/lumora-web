export type Fyp94StorageMode = "local" | "r2";

export function getFyp94StorageMode(): Fyp94StorageMode {
  return process.env.FYP94_STORAGE_MODE === "r2" ? "r2" : "local";
}

export function getFyp94CdnBaseUrl(): string {
  return process.env.FYP94_CDN_BASE_URL || "";
}

export function mapFyp94PlaybackUrl(localUrl: string): string {
  const mode = getFyp94StorageMode();

  if (mode === "local") return localUrl;

  const cdn = getFyp94CdnBaseUrl().replace(/\/$/, "");
  if (!cdn) return localUrl;

  return `${cdn}${localUrl}`;
}
