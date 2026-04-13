export type TeaserMediaAsset = {
  url: string;
  mimeType?: string;
  width?: number;
  height?: number;
  durationMs?: number;
  language?: string;
  region?: string;
};

export type NormalizedTeaserMediaAsset = TeaserMediaAsset & {
  url: string;
  mimeType: string;
  aspectRatio?: number;
  language: string;
  region: string;
};

function normalizeMimeType(value?: string): string {
  const raw = (value || "").trim().toLowerCase();
  if (!raw) return "application/octet-stream";
  return raw;
}

function computeAspectRatio(width?: number, height?: number): number | undefined {
  if (!width || !height || width <= 0 || height <= 0) return undefined;
  return Number((width / height).toFixed(4));
}

export function normalizeTeaserMediaAsset(
  asset: TeaserMediaAsset
): NormalizedTeaserMediaAsset {
  return {
    ...asset,
    url: asset.url.trim(),
    mimeType: normalizeMimeType(asset.mimeType),
    aspectRatio: computeAspectRatio(asset.width, asset.height),
    language: asset.language?.trim().toLowerCase() || "en",
    region: asset.region?.trim().toLowerCase() || "global",
  };
}

export function isUsableTeaserMediaAsset(
  asset: NormalizedTeaserMediaAsset
): boolean {
  return asset.url.length > 0 && asset.mimeType !== "application/octet-stream";
}
