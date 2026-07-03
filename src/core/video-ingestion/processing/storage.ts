import type { ProcessedVideoAsset, ProcessingPlan } from "./types";

export type StorageManifest = {
  id: string;
  assetId: string;
  providerId: string;
  storageKey: string;
  objects: {
    original: string;
    thumbnail?: string;
    preview?: string;
    normalized?: string;
  };
  createdAt: string;
};

export function createStorageManifest(
  asset: ProcessedVideoAsset,
  plan: ProcessingPlan,
): StorageManifest {
  const key = asset.processing.storageKey ?? `storage/${asset.providerId}/${asset.id}`;

  return {
    id: `storage_manifest_${asset.id}`,
    assetId: asset.id,
    providerId: asset.providerId,
    storageKey: key,
    objects: {
      original: asset.sourceUrl,
      thumbnail: asset.processing.thumbnailUrl,
      preview: asset.processing.previewUrl,
      normalized: asset.processing.normalizedUrl,
    },
    createdAt: new Date().toISOString(),
  };
}
