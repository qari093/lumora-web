export type PosterArtworkAsset = {
  id: string;
  entityId: string;
  sourceId: string;
  url: string;
  kind: "poster" | "artwork" | "key-art";
  width?: number;
  height?: number;
  language?: string;
  region?: string;
  ingestedAt: string;
};

export function normalizePosterArtworkAsset(
  asset: PosterArtworkAsset
): PosterArtworkAsset {
  return {
    ...asset,
    url: asset.url.trim(),
    language: asset.language?.trim().toLowerCase() || "en",
    region: asset.region?.trim().toLowerCase() || "global",
  };
}

export function isPosterArtworkUsable(asset: PosterArtworkAsset): boolean {
  return (
    asset.url.trim().length > 0 &&
    (asset.kind === "poster" ||
      asset.kind === "artwork" ||
      asset.kind === "key-art")
  );
}
